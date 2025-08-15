package graph

import (
	"fmt"

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

func (g Graph) TraverseGraph(input VerifyGraphInput) bool {
	var foundNode *node.Node
	var foundEdges []edge.Edge

	// Find the node of input
	for i := range g.Nodes {
		if g.Nodes[i].ID == input.NodeID {
			foundNode = &g.Nodes[i]
			break
		}
	}

	if foundNode == nil {
		panic("Node not found")
	}

	// Find the edges related to the node
	for i := range g.Edges {
		if g.Edges[i].SourceNode == foundNode.ID || g.Edges[i].TargetNode == foundNode.ID {
			foundEdges = append(foundEdges, g.Edges[i])
		}
	}

	if len(foundEdges) == 0 {
		return g.ValidateFieldInput(input, *foundNode)
	}

	// Temp
	return true
}

func (g Graph) ValidateFieldInput(input VerifyGraphInput, n node.Node) bool {
	//
	for _, rule := range n.ValidationRules {
		fmt.Println("validation rule >>", rule)
	}

	// Temp
	return true
}
