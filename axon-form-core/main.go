package main

import (
	"fmt"

	"axon-form/core/internal/edge"
	"axon-form/core/internal/graph"
	"axon-form/core/internal/node"
	"axon-form/core/internal/util"
)

func main() {
	graphJson := util.ReadFile("example-graph.json")
	nodesJson := graphJson["nodes"]
	edgesJson := graphJson["edges"]
	conditionGroupsJson := graphJson["condition_groups"]

	util.NewLogger()
	// logger := util.GetLogger()

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

	input := graph.VerifyNodeInput{
		NodeID: "wu16d202mgqo6bm",
		Value:  "international",
	}

	success, err := g.ValidateNode(input)
	if err != nil {
		panic(util.MultiError{Errors: err})
	}

	fmt.Println("success >>", success)

	// for _, n := range nodes {
	// 	if n.ID == "wu16d202mgqo6bm" {
	// 	}
	// 	logger.Debug("Found node:", zap.Any("node", n))
	// }

	// for _, e := range edges {
	// 	if e.ID == "rdk4e7zcw2qh4bb" {
	// 		logger.Debug("Found edge:", zap.Any("edge", e))
	// 	}
	// }
}
