package main

import (
	"axon-form/core/internal/edge"
	"axon-form/core/internal/graph"
	"axon-form/core/internal/node"
	"axon-form/core/internal/util"
)

func main() {
	graphJson := util.ReadFile("example-graph-simple.json")
	nodesJson := graphJson["nodes"]
	edgesJson := graphJson["edges"]
	conditionGroupsJson := graphJson["condition_groups"]

	util.NewLogger()

	var nodes []node.Node
	var edges []edge.Edge
	var conditionGroups []edge.EdgeConditionGroup

	for _, n := range nodesJson {
		nodeJson := n.(map[string]any)
		newNode := node.NewNodeFromJSON(nodeJson)
		nodes = append(nodes, newNode)
	}

	for _, e := range edgesJson {
		edgeJson := e.(map[string]any)
		newEdge := edge.NewEdgeFromJSON(edgeJson)
		edges = append(edges, newEdge)
	}

	for _, e := range conditionGroupsJson {
		conditionGroupJson := e.(map[string]any)
		conditionGroup := edge.NewEdgeConditionGroupFromJSON(conditionGroupJson, edges)
		conditionGroups = append(conditionGroups, conditionGroup)
	}

	g := graph.NewGraph(
		nodes,
		edges,
		conditionGroups,
	)

	product_type_input := graph.VerifyNodeInput{
		NodeID: "t494fub1vww8jv2",
		Value:  "Laptop",
	}

	customer_name_input := graph.VerifyNodeInput{
		NodeID: "b8mvlvxveal87lw",
		Value:  "Sambath",
	}

	email_input := graph.VerifyNodeInput{
		NodeID: "7fzhb9en55ntbeh",
		Value:  "test@gmail.com",
	}

	delivery_option_input := graph.VerifyNodeInput{
		NodeID: "byfr5rsuiidyvsq",
		Value:  "Pickup",
	}

	g.ValidateNode(product_type_input)
	g.ValidateNode(customer_name_input)
	g.ValidateNode(email_input)
	g.ValidateNode(delivery_option_input)

	g.GetFormValue()
	// if err != nil {
	// 	panic(util.MultiError{Errors: err})
	// }
}
