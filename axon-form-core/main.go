package main

import (
	"axon-form/core/internal/edge"
	"axon-form/core/internal/node"
	"axon-form/core/internal/util"

	"go.uber.org/zap"
)

func main() {
	graphJson := util.ReadFile("example-graph.json")
	nodesJson := graphJson["nodes"]
	edgesJson := graphJson["edges"]

	util.NewLogger()
	logger := util.GetLogger()

	var nodes []node.Node
	var edges []edge.Edge

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

	for _, n := range nodes {
		if n.ID == "wu16d202mgqo6bm" {
			logger.Debug("Found node:", zap.Any("node", n))
		}
	}

	for _, e := range edges {
		if e.ID == "rdk4e7zcw2qh4bb" {
			logger.Debug("Found edge:", zap.Any("edge", e))
		}
	}
}
