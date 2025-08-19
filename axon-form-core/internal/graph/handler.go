package graph

import (
	"errors"
	"fmt"
	"regexp"
	"strconv"
	"strings"

	"axon-form/core/internal/edge"
	"axon-form/core/internal/node"
)

func NewGraph(
	Nodes []node.Node,
	Edges []edge.Edge,
) Graph {
	return Graph{
		Nodes: Nodes,
		Edges: Edges,
	}
}

func (g Graph) GetNodeByID(id string) *node.Node {
	var node *node.Node

	// Find the node of input
	for i := range g.Nodes {
		if g.Nodes[i].ID == id {
			node = &g.Nodes[i]
			break
		}
	}

	return node
}

func (g Graph) ValidateNode(input VerifyNodeInput) (bool, []error) {
	var foundEdges []edge.Edge

	foundNode := g.GetNodeByID(input.NodeID)

	if foundNode == nil {
		panic("Node not found")
	}

	_, fieldErrors := g.ValidateNodeValidationRules(input, *foundNode)

	// Return errors if there is an invalid field validation
	if len(fieldErrors) > 0 {
		return false, fieldErrors
	}

	// Find edges related to the node
	for i := range g.Edges {
		if g.Edges[i].SourceNode == foundNode.ID || g.Edges[i].TargetNode == foundNode.ID {
			foundEdges = append(foundEdges, g.Edges[i])
		}
	}

	if len(foundEdges) == 0 {
		return true, nil
	}

	// Validate edges connected to the node
	for _, e := range foundEdges {
		//
		// ONLY Validate conditions for edges with type show and roots from the node
		if e.Type != edge.EdgeTypeShows || e.SourceNode != foundNode.ID {
			continue
		}
		//
		_, edgeErrors := g.ValidateEdgeConditions(e, input)

		// Update node visibility
		if len(edgeErrors) == 0 {
			nodeToUpdate := g.GetNodeByID(e.TargetNode)
			nodeToUpdate.IsVisible = true
		}
	}

	return true, nil
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
		fmt.Println("=== Performing ValidationRuleTypeRequired")
		if len(v) > 0 {
			return true, nil
		}
		return false, errors.New(r.Message)
	//
	case node.ValidationRuleTypeMinLength:
		fmt.Println("=== Performing ValidationRuleTypeMinLength")
		minLength, err := strconv.Atoi(r.Value)
		if err != nil {
			panic(err)
		}
		return len(v) >= minLength, errors.New(r.Message)
	//
	case node.ValidationRuleTypeMaxLength:
		fmt.Println("=== Performing ValidationRuleTypeMaxLength")
		maxLength, err := strconv.Atoi(r.Value)
		if err != nil {
			panic(err)
		}
		return len(v) <= maxLength, errors.New(r.Message)
	//
	case node.ValidationRuleTypeMin:
		fmt.Println("=== Performing ValidationRuleTypeMin")
		return v >= r.Value, errors.New(r.Message)
	//
	case node.ValidationRuleTypeMax:
		fmt.Println("=== Performing ValidationRuleTypeMax")
		return v <= r.Value, errors.New(r.Message)
	//
	case node.ValidationRuleTypePattern:
		fmt.Println("=== Performing ValidationRuleTypePattern")
		regex := r.Value
		match, _ := regexp.MatchString(regex, v)
		return match, errors.New("value does not pass regex validation")
	//
	case node.ValidationRuleTypeEmail:
		fmt.Println("=== Performing ValidationRuleTypeEmail")
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
		fmt.Println("=== Performing ConditionExpressionEqual")
		return v == c.ExpectedValue, errors.New("condition not met: equal")
	//
	case edge.ConditionExpressionMoreThan:
		fmt.Println("=== Performing ConditionExpressionMoreThan")
		return v > c.ExpectedValue, errors.New("condition not met: more than")
	//
	case edge.ConditionExpressionLessThan:
		fmt.Println("=== Performing ConditionExpressionLessThan")
		return v < c.ExpectedValue, errors.New("condition not met: less than")
	//
	case edge.ConditionExpressionMoreThanOrEqual:
		fmt.Println("=== Performing ConditionExpressionMoreThanOrEqual")
		return v >= c.ExpectedValue, errors.New("condition not met: more than or equal")
	//
	case edge.ConditionExpressionLessThanOrEqual:
		fmt.Println("=== Performing ConditionExpressionLessThanOrEqual")
		return v <= c.ExpectedValue, errors.New("condition not met: less than or equal")
	//
	case edge.ConditionExpressionNotEqual:
		fmt.Println("=== Performing ConditionExpressionNotEqual")
		return v != c.ExpectedValue, errors.New("condition not met: not equal")
	//
	case edge.ConditionExpressionContains:
		fmt.Println("=== Performing ConditionExpressionContains")
		return strings.Contains(v, c.ExpectedValue), errors.New("condition not met: contains")
	//
	case edge.ConditionExpressionStartsWith:
		fmt.Println("=== Performing ConditionExpressionStartsWith")
		return strings.HasPrefix(v, c.ExpectedValue), errors.New("condition not met: starts with")
	//
	case edge.ConditionExpressionEndsWith:
		fmt.Println("=== Performing ConditionExpressionEndsWith")
		return strings.HasSuffix(v, c.ExpectedValue), errors.New("condition not met: ends with")
	}

	return false, nil
}
