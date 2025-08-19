package graph

import (
	"axon-form/core/internal/edge"
	"axon-form/core/internal/node"
)

type Graph struct {
	Nodes []node.Node
	Edges []edge.Edge
}

type VerifyNodeInput struct {
	NodeID string
	Value  string
}
