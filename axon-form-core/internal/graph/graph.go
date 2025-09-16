package graph

import (
	"axon-form/core/internal/edge"
	"axon-form/core/internal/node"
)

type Graph struct {
	Nodes           map[string]map[string]*node.Node
	Edges           map[string][]*edge.Edge
	ConditionGroups map[string]*edge.EdgeConditionGroup
}

type VerifyNodeInput struct {
	NodeID string
	Value  string
}
