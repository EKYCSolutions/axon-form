package graph

import (
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"regexp"
	"strconv"
	"strings"

	"axon-form/core/internal/edge"
	"axon-form/core/internal/node"
	"axon-form/core/internal/page"
	"axon-form/core/internal/util"
)

func (g *Graph) InitGraph(
	jsonBytes []byte,
) bool {
	var graphJson map[string]interface{}
	err := json.Unmarshal(jsonBytes, &graphJson)
	if err != nil {
		panic(err)
	}

	layoutsJson := graphJson["layout"].(map[string]interface{})
	pagesJson := layoutsJson["pages"].([]interface{})
	nodesJson := graphJson["nodes"].([]interface{})
	edgesJson := graphJson["edges"].([]interface{})
	conditionGroupsJson := graphJson["condition_groups"].([]interface{})

	// initialize nodes, edges and condition groups
	g.Nodes = make(map[string]map[string]*node.Node)
	g.Edges = make(map[string][]*edge.Edge)
	g.ConditionGroups = make(map[string]*edge.EdgeConditionGroup)
	g.Pages = make(map[string]*page.Page)

	//
	g.InitNodeGroup("inputs")
	g.InitNodeGroup("values")
	g.InitNodeGroup("pages")

	for _, p := range pagesJson {
		pageJson := p.(map[string]any)
		newPage := page.NewPageFromJSON(pageJson)
		//
		g.Pages[newPage.ID] = &newPage
	}

	for _, n := range nodesJson {
		nodeJson := n.(map[string]any)
		newNode := node.NewNodeFromJSON(nodeJson)
		switch newNode.NodeType {
		case node.NodeTypeInput:
			g.Nodes["inputs"][newNode.ID] = &newNode
		case node.NodeTypeValue:
			g.Nodes["values"][newNode.ID] = &newNode
		case node.NodeTypePage:
			g.Nodes["pages"][newNode.ID] = &newNode
		}
	}

	//
	for _, e := range edgesJson {
		edgeJson := e.(map[string]any)
		newEdge := edge.NewEdgeFromJSON(edgeJson)
		//
		g.Edges[newEdge.SourceNode] = append(g.Edges[newEdge.SourceNode], &newEdge)
	}

	//
	for _, e := range conditionGroupsJson {
		conditionGroupJson := e.(map[string]any)
		conditionGroup := edge.NewEdgeConditionGroupFromJSON(conditionGroupJson)
		//
		g.ConditionGroups[conditionGroup.ID] = &conditionGroup
	}

	return true
}

func (g Graph) InitNodeGroup(group string) {
	if _, ok := g.Nodes[group]; !ok {
		g.Nodes[group] = make(map[string]*node.Node)
	}
}

func (g Graph) GetPageFormValue(pageID string) string {
	result := make(map[string]any)
	//
	foundPage := page.GetPageByID(pageID, g.Pages)

	for _, nid := range foundPage.FieldIDs {
		foundNode := node.GetNodeByID(nid, g.Nodes["inputs"])
		result[foundNode.FieldName] = foundNode.Value
	}

	jsonBytes, err := json.Marshal(result)
	if err != nil {
		log.Fatal(err)
	}

	return string(jsonBytes)
}

func (g Graph) GetFormValue() string {
	result := make(map[string]any)
	//
	inputNodes := g.Nodes["inputs"]

	for _, n := range inputNodes {
		result[n.FieldName] = n.Value
	}

	jsonBytes, err := json.Marshal(result)
	if err != nil {
		log.Fatal(err)
	}

	return string(jsonBytes)
}

func (g Graph) IsNodeVisible(nodeID string) bool {
	foundNode := node.GetNodeByID(nodeID, g.Nodes["inputs"])

	if foundNode == nil {
		panic("Node not found")
	}

	return foundNode.IsVisible
}

func (g Graph) updateFoundNodeValue(input VerifyNodeInput, foundNode *node.Node) {
	isFieldTypeWithOptions := node.IsFieldTypeWithOptions(foundNode.FieldType)

	if isFieldTypeWithOptions {
		optionNodeId := fmt.Sprintf("%v", input.Value)
		foundOptionNode := node.GetNodeByID(optionNodeId, g.Nodes["values"])
		// Update node value
		foundNode.Value = foundOptionNode.Value
	} else {
		foundNode.Value = input.Value
	}
}

func (g Graph) ValidateNode(input VerifyNodeInput) (bool, []error) {
	var foundEdges []*edge.Edge

	foundNode := node.GetNodeByID(input.NodeID, g.Nodes["inputs"])

	if foundNode == nil {
		panic("Node not found")
	}

	_, fieldErrors := g.ValidateNodeValidationRules(input, *foundNode)

	// Return errors if there is an invalid field validation
	if len(fieldErrors) > 0 {
		return false, fieldErrors
	}

	// Find edges related to the node
	foundEdges = g.Edges[input.NodeID]

	if len(foundEdges) == 0 {
		// Update node value
		g.updateFoundNodeValue(input, foundNode)
		return true, nil
	}

	// Validate edges connected to the node
	for _, e := range foundEdges {
		// ONLY Validate conditions for edges with type show and roots from the node
		if e.Type != edge.EdgeTypeShows {
			continue
		}
		//
		_, edgeErrors := g.ValidateEdgeConditions(*e, input)

		// Update node visibility
		if len(edgeErrors) > 0 {
			continue
		}

		nodeToUpdate := node.GetNodeByID(e.TargetNode, g.Nodes["inputs"])
		nodeToUpdate.IsVisible = true

		g.UpdateConditionGroupEdgeValid(e.ID)
	}

	for _, cg := range g.ConditionGroups {
		valid := g.ValidateConditionGroup(*cg)
		//
		if valid {
			node := node.GetNodeByID(cg.NodeID, g.Nodes["inputs"])
			node.IsVisible = true
		}
	}

	// Update node value
	g.updateFoundNodeValue(input, foundNode)

	return true, nil
}

func (g Graph) UpdateConditionGroupEdgeValid(edgeID string) {
	for _, cg := range g.ConditionGroups {
		for _, id := range cg.EdgeIDs {
			if id == edgeID {
				cg.ValidEdges[edgeID] = true
			}
		}
	}
}

func (g Graph) ValidateConditionGroup(cg edge.EdgeConditionGroup) bool {
	return util.EvalPostfix(cg.PostfixExpr, cg.ValidEdges)
}

func (g Graph) ValidateNodeValidationRules(i VerifyNodeInput, n node.Node) ([]bool, []error) {
	fieldValid := make([]bool, len(n.ValidationRules))
	var errorMessages []error
	//
	for idx, rule := range n.ValidationRules {
		passValidation, err := g.ValidateRule(rule, i.Value)
		//
		if !passValidation {
			errorMessages = append(errorMessages, err)
		}
		//
		fieldValid[idx] = passValidation
	}

	return fieldValid, errorMessages
}

func (g Graph) ValidateEdgeConditions(e edge.Edge, i VerifyNodeInput) ([]bool, []error) {
	edgeValid := make([]bool, len(e.Conditions))
	var errorMessages []error
	//
	for idx, condition := range e.Conditions {
		passCondition, err := g.ValidateCondition(condition, i.Value)

		if !passCondition {
			errorMessages = append(errorMessages, err)
		}

		edgeValid[idx] = passCondition

	}

	return edgeValid, errorMessages
}

func (g Graph) ValidateRule(r node.ValidationRule, v string) (bool, error) {
	switch r.Type {
	//
	case node.ValidationRuleTypeRequired:
		if len(v) > 0 {
			return true, nil
		}
		return false, errors.New(r.Message)
	//
	case node.ValidationRuleTypeMinLength:
		minLength, err := strconv.Atoi(r.Value)
		if err != nil {
			panic(err)
		}
		return len(v) >= minLength, errors.New(r.Message)
	//
	case node.ValidationRuleTypeMaxLength:
		maxLength, err := strconv.Atoi(r.Value)
		if err != nil {
			panic(err)
		}
		return len(v) <= maxLength, errors.New(r.Message)
	//
	case node.ValidationRuleTypeMin:
		return v >= r.Value, errors.New(r.Message)
	//
	case node.ValidationRuleTypeMax:
		return v <= r.Value, errors.New(r.Message)
	//
	case node.ValidationRuleTypePattern:
		regex := r.Value
		match, _ := regexp.MatchString(regex, v)
		return match, errors.New("value does not pass regex validation")
	//
	case node.ValidationRuleTypeEmail:
		emailRegex := `^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$`
		match, _ := regexp.MatchString(emailRegex, v)
		return match, errors.New(r.Message)
	//
	default:
		return false, nil
	}
}

func (g Graph) ValidateCondition(c edge.EdgeCondition, v string) (bool, error) {
	switch c.Expression {
	//
	case edge.ConditionExpressionEqual:
		return v == c.ExpectedValue, errors.New("condition not met: equal")
	//
	case edge.ConditionExpressionMoreThan:
		return v > c.ExpectedValue, errors.New("condition not met: more than")
	//
	case edge.ConditionExpressionLessThan:
		return v < c.ExpectedValue, errors.New("condition not met: less than")
	//
	case edge.ConditionExpressionMoreThanOrEqual:
		return v >= c.ExpectedValue, errors.New("condition not met: more than or equal")
	//
	case edge.ConditionExpressionLessThanOrEqual:
		return v <= c.ExpectedValue, errors.New("condition not met: less than or equal")
	//
	case edge.ConditionExpressionNotEqual:
		return v != c.ExpectedValue, errors.New("condition not met: not equal")
	//
	case edge.ConditionExpressionContains:
		return strings.Contains(v, c.ExpectedValue), errors.New("condition not met: contains")
	//
	case edge.ConditionExpressionStartsWith:
		return strings.HasPrefix(v, c.ExpectedValue), errors.New("condition not met: starts with")
	//
	case edge.ConditionExpressionEndsWith:
		return strings.HasSuffix(v, c.ExpectedValue), errors.New("condition not met: ends with")
	}

	return false, nil
}
