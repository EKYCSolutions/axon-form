package graph

import (
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"regexp"
	"strconv"
	"strings"

	"axon-form/core/internal/address"
	"axon-form/core/internal/edge"
	"axon-form/core/internal/node"
	"axon-form/core/internal/page"
	"axon-form/core/internal/util"
)

func (g *Graph) InitGraph(
	jsonBytes []byte,
) (bool, error) {
	var graphJson map[string]interface{}
	err := json.Unmarshal(jsonBytes, &graphJson)
	if err != nil {
		return false, err
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
		newPage, err := page.NewPageFromJSON(pageJson)
		//
		if err != nil {
			return false, err
		}
		//
		g.Pages[newPage.ID] = newPage
	}

	for _, n := range nodesJson {
		nodeJson := n.(map[string]any)
		newNode, err := node.NewNodeFromJSON(nodeJson)
		//
		if err != nil {
			return false, err
		}
		//
		switch newNode.NodeType {
		case node.NodeTypeInput:
			g.Nodes["inputs"][newNode.ID] = newNode
		case node.NodeTypeValue:
			g.Nodes["values"][newNode.ID] = newNode
		case node.NodeTypePage:
			g.Nodes["pages"][newNode.ID] = newNode
		}
	}

	//
	for _, e := range edgesJson {
		edgeJson := e.(map[string]any)
		newEdge, err := edge.NewEdgeFromJSON(edgeJson)
		//
		if err != nil {
			return false, err
		}
		//
		g.Edges[newEdge.SourceNode] = append(g.Edges[newEdge.SourceNode], newEdge)
	}

	//
	for _, e := range conditionGroupsJson {
		conditionGroupJson := e.(map[string]any)
		conditionGroup, err := edge.NewEdgeConditionGroupFromJSON(conditionGroupJson)
		//
		if err != nil {
			return false, err
		}
		//
		g.ConditionGroups[conditionGroup.ID] = conditionGroup
	}

	return true, nil
}

func (g *Graph) InitAddress(jsonBytes []byte) (bool, error) {
	a := address.Address{}
	a.InitAddress(jsonBytes)
	g.Address = &a
	//

	inputNodes := g.Nodes["inputs"]
	provinceInputs := node.GetAddressNode(inputNodes, "province")

	provinces, err := g.Address.GetProvinces()

	if err != nil {
		return false, err
	}

	for _, pInput := range *provinceInputs {
		g.refreshAddressOptionNodesAndEdges(provinces, pInput)
	}
	return true, nil
}

func (g *Graph) InitNodeGroup(group string) {
	if _, ok := g.Nodes[group]; !ok {
		g.Nodes[group] = make(map[string]*node.Node)
	}
}

func (g Graph) GetPageFormValue(pageID string) (string, error) {
	result := make(map[string]any)
	//
	foundPage := page.GetPageByID(pageID, g.Pages)

	for _, id := range foundPage.FieldIDs {
		n, ok := g.Nodes["inputs"][id]
		if !ok {
			return "", errors.New("Node not found")
		}
		isAddressNode, level := node.IsAddressNode(n)
		if isAddressNode {
			parentNode, err := g.GetParentNode(n.ID)
			if level != "province" && err != nil {
				return "", err
			}

			addressList, err := g.getAddressList(parentNode, level)

			if err != nil {
				return "", err
			}

			for _, addr := range addressList {
				if addr.Key == n.Value {
					result[n.FieldName] = addr
				}
			}
		} else {
			result[n.FieldName] = n.Value
		}
	}

	jsonBytes, err := json.Marshal(result)
	if err != nil {
		return "", err
	}

	return string(jsonBytes), nil
}

func (g Graph) GetFormValue() (string, error) {
	result := make(map[string]any)
	//
	inputNodes := g.Nodes["inputs"]

	for _, n := range inputNodes {
		isAddressNode, level := node.IsAddressNode(n)
		if isAddressNode {
			parentNode, err := g.GetParentNode(n.ID)
			if level != "province" && err != nil {
				return "", err
			}

			addressList, err := g.getAddressList(parentNode, level)

			if err != nil {
				return "", err
			}

			for _, addr := range addressList {
				if addr.Key == n.Value {
					result[n.FieldName] = addr
				}
			}
		} else {
			result[n.FieldName] = n.Value
		}
	}

	jsonBytes, err := json.Marshal(result)
	if err != nil {
		log.Fatal(err)
	}

	return string(jsonBytes), nil

}

func (g Graph) IsNodeVisible(nodeID string) (bool, error) {
	n, ok := g.Nodes["inputs"][nodeID]
	if !ok {
		return false, errors.New("Node not found")
	}

	return n.IsVisible, nil
}

func (g Graph) updateNodeValue(input ValidateNodeInput, n *node.Node) (bool, error) {
	isFieldTypeWithOptions := node.IsFieldTypeWithOptions(n.FieldType)

	if isFieldTypeWithOptions {
		optionNodeId := input.Value
		optionNode, ok := g.Nodes["values"][optionNodeId]
		if !ok {
			return false, errors.New("Option node not found")
		}

		var foundEdge *edge.Edge

		tEdges := g.Edges[n.ID]

		for _, e := range tEdges {
			if e.TargetNode == optionNodeId {
				foundEdge = e
				break
			}
		}

		if foundEdge == nil {
			return false, errors.New("Invalid option node")
		}

		// Update node value
		n.Value = optionNode.Value
	} else {
		n.Value = input.Value
	}

	return true, nil
}

func (g Graph) ValidateNode(input ValidateNodeInput) (bool, []error) {
	var foundEdges []*edge.Edge

	n, ok := g.Nodes["inputs"][input.NodeID]

	if !ok {
		return false, []error{errors.New("Node not found")}
	}

	_, fieldErrors := g.ValidateNodeValidationRules(input, *n)

	// Return errors if there is an invalid field validation
	if len(fieldErrors) > 0 {
		return false, fieldErrors
	}

	// Find edges related to the node
	foundEdges = g.Edges[input.NodeID]

	if len(foundEdges) == 0 {
		// Update node value
		_, err := g.updateNodeValue(input, n)
		if err != nil {
			return false, []error{err}
		}
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

		nodeToUpdate, ok := g.Nodes["inputs"][e.TargetNode]
		if !ok {
			return false, []error{errors.New("Node not found")}
		}
		nodeToUpdate.IsVisible = true

		g.UpdateConditionGroupEdgeValid(e.ID)
	}

	for _, cg := range g.ConditionGroups {
		valid := g.ValidateConditionGroup(*cg)
		//
		if valid {
			n, ok := g.Nodes["inputs"][cg.NodeID]
			if !ok {
				return false, []error{errors.New("Node not found")}
			}
			n.IsVisible = true
		}
	}

	// Update node value
	_, err := g.updateNodeValue(input, n)
	if err != nil {
		return false, []error{err}
	}

	return true, nil
}

func (g Graph) ValidateAddressNode(input ValidateNodeInput) (bool, []error, []string) {
	valid, valErr := g.ValidateNode(input)
	if !valid && len(valErr) > 0 {
		return false, valErr, []string{}
	}
	//
	n, ok := g.Nodes["inputs"][input.NodeID]
	if !ok {
		return false, []error{errors.New("Node not found")}, []string{}
	}
	g.updateAddressNodeOptions(*n)

	//
	childrenNodes, err := g.getAddressChildrenNodeIds(*n)

	if err != nil {
		return false, []error{err}, []string{}
	}

	return valid, nil, childrenNodes
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

func (g Graph) ValidateNodeValidationRules(i ValidateNodeInput, n node.Node) ([]bool, []error) {
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

func (g Graph) ValidateEdgeConditions(e edge.Edge, i ValidateNodeInput) ([]bool, []error) {
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
			return false, err
		}
		return len(v) >= minLength, errors.New(r.Message)
	//
	case node.ValidationRuleTypeMaxLength:
		maxLength, err := strconv.Atoi(r.Value)
		if err != nil {
			return false, err
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

func (g Graph) GetOptionNodes(nodeId string) (*[]node.Node, error) {
	var optionNodes []node.Node
	//
	edges := g.Edges[nodeId]

	for _, e := range edges {
		if e.Type == edge.EdgeTypeHasOption {
			n, ok := g.Nodes["values"][e.TargetNode]
			if !ok {
				return nil, errors.New("Node not found")
			}
			optionNodes = append(optionNodes, *n)
		}
	}

	return &optionNodes, nil
}

func (g Graph) GetParentNode(nodeId string) (*node.Node, error) {
	var n *node.Node

	tEdge := edge.GetEdgeByNode(nodeId, "source", g.Edges)
	//
	if tEdge == nil {
		return n, errors.New("Parent node not found")
	}

	n, ok := g.Nodes["inputs"][tEdge.TargetNode]

	if !ok {
		return n, errors.New("Child Node not found")
	}

	return n, nil
}

func (g Graph) GetChildNode(nodeId string) (*node.Node, error) {
	var n *node.Node

	tEdge := edge.GetEdgeByNode(nodeId, "target", g.Edges)
	//
	if tEdge == nil {
		return n, errors.New("Child node not found")
	}

	n, ok := g.Nodes["inputs"][tEdge.SourceNode]

	if !ok {
		return n, errors.New("Child Node not found")
	}

	return n, nil
}

func (g Graph) updateAddressNodeOptions(parentNode node.Node) (bool, error) {
	//
	e := edge.GetEdgeByNode(parentNode.ID, "target", g.Edges)

	if e == nil {
		return false, errors.New("Edge not found")
	}

	n, ok := g.Nodes["inputs"][e.SourceNode]
	if !ok {
		return false, errors.New("Node not found")
	}

	_, level := node.IsAddressNode(n)
	addressList, err := g.getAddressList(&parentNode, level)
	if err != nil {
		return false, errors.New("Address not found")
	}
	g.refreshAddressOptionNodesAndEdges(addressList, *n)
	return true, nil
}

func (g Graph) refreshAddressOptionNodesAndEdges(addressList []address.AddressInfo, sourceNode node.Node) (bool, error) {
	var ID_LENGTH = 15
	// Clear any existing relations before adding new ones
	// Remove existing option edges and their corresponding value nodes
	//

	if len(g.Edges[sourceNode.ID]) > 0 {
		nodesToRefresh := []string{sourceNode.ID}
		ids, err := g.getAddressChildrenNodeIds(sourceNode)
		if err != nil {
			return false, err
		}

		nodesToRefresh = append(nodesToRefresh, ids...)
		for _, id := range nodesToRefresh {
			n, ok := g.Nodes["inputs"][id]
			if !ok {
				return false, err

			}
			g.clearAddressOptionNode(*n)
		}
	}

	for idx, address := range addressList {
		vNodeId, err := util.GenerateID(ID_LENGTH)
		if err != nil {
			return false, err
		}

		vNode := node.Node{
			ID:              *vNodeId,
			Order:           idx,
			Label:           address.NameEn,
			NodeType:        node.NodeTypeValue,
			FieldType:       node.NodeFieldTypeNone,
			FieldName:       "",
			IsVisible:       false,
			ValidationRules: nil,
			Value:           *vNodeId,
		}

		pEdgeId, err := util.GenerateID(ID_LENGTH)
		//
		if err != nil {
			return false, err
		}

		pEdge := edge.Edge{
			ID:         *pEdgeId,
			Label:      fmt.Sprintf("option-%s", address.Key),
			SourceNode: sourceNode.ID,
			TargetNode: *vNodeId,
			Type:       edge.EdgeTypeHasOption,
			Conditions: nil,
			Configs:    nil,
		}

		g.Nodes["values"][*vNodeId] = &vNode
		g.Edges[sourceNode.ID] = append(g.Edges[sourceNode.ID], &pEdge)
	}

	return true, nil
}

func (g Graph) getAddressParentNode(childNode node.Node) (*node.Node, error) {
	edge := edge.GetEdgeByNode(childNode.ID, "source", g.Edges)

	if edge == nil {
		return nil, errors.New("Edge not found")
	}

	parentNode, ok := g.Nodes["inputs"][edge.TargetNode]
	if !ok {
		return nil, errors.New("Node not found")
	}

	return parentNode, nil
}

func (g Graph) clearAddressOptionNode(n node.Node) {
	var filteredEdges []*edge.Edge

	for _, e := range g.Edges[n.ID] {
		if e.Type == edge.EdgeTypeHasOption {
			// Remove old address options
			delete(g.Nodes["values"], e.TargetNode)
		} else {
			// Filter only edges that are not has_option type
			filteredEdges = append(filteredEdges, e)
		}
	}

	g.Edges[n.ID] = filteredEdges
}

func (g Graph) getAddressChildrenNodeIds(parentNode node.Node) ([]string, error) {
	var childrenNodeIds []string
	//
	// In the address hierarchy, parent and child nodes are connected by a FILTER_BY edge.
	// The source node of this edge is the child, and the target node is the parent,
	// indicating that the child's options are filtered based on the parent's selection.
	//
	tEdge := edge.GetEdgeByNode(parentNode.ID, "target", g.Edges)

	if tEdge == nil {
		return []string{}, nil
	}
	//

	childNode, ok := g.Nodes["inputs"][tEdge.SourceNode]
	if !ok {
		return []string{}, errors.New("Node not found")
	}
	//
	childrenNodeIds = append(childrenNodeIds, childNode.ID)
	ids, err := g.getAddressChildrenNodeIds(*childNode)

	if err != nil {
		return []string{}, err
	}

	childrenNodeIds = append(childrenNodeIds, ids...)
	//
	return childrenNodeIds, nil
}

func (g Graph) getAddressList(parentNode *node.Node, level string) ([]address.AddressInfo, error) {
	addressList := []address.AddressInfo{}

	switch level {
	case "province":
		provinces, err := g.Address.GetProvinces()

		if err != nil {
			return []address.AddressInfo{}, err
		}

		addressList = provinces
	case "district":
		provinceNode := parentNode
		provinceKey, _ := provinceNode.Value.(string)
		//
		districts, err := g.Address.GetDistricts(provinceKey)

		if err != nil {
			return []address.AddressInfo{}, err
		}

		addressList = districts
	case "commune":
		districtNode := parentNode
		districtKey, _ := parentNode.Value.(string)
		//
		provinceNode, err := g.getAddressParentNode(*districtNode)
		if err != nil {
			return []address.AddressInfo{}, err
		}

		provinceKey := provinceNode.Value.(string)
		//
		communes, err := g.Address.GetCommunes(provinceKey, districtKey)

		if err != nil {
			return []address.AddressInfo{}, err
		}

		addressList = communes
	case "village":
		communeNode := parentNode
		communeKey, _ := parentNode.Value.(string)
		//
		districtNode, err := g.getAddressParentNode(*communeNode)
		if err != nil {
			return []address.AddressInfo{}, err
		}

		districtKey := districtNode.Value.(string)
		//
		provinceNode, err := g.getAddressParentNode(*districtNode)
		if err != nil {
			return []address.AddressInfo{}, err
		}

		provinceKey := provinceNode.Value.(string)
		//
		villages, err := g.Address.GetVillages(provinceKey, districtKey, communeKey)

		if err != nil {
			return []address.AddressInfo{}, err
		}

		addressList = villages
	}

	return addressList, nil
}
