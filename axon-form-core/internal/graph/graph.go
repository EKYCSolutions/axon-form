package graph

import (
	"axon-form/core/internal/edge"
	"axon-form/core/internal/node"
	"axon-form/core/internal/page"
)

type Graph struct {
	Nodes           map[string]map[string]*node.Node
	Edges           map[string][]*edge.Edge
	ConditionGroups map[string]*edge.EdgeConditionGroup
	Pages           map[string]*page.Page
}

type VerifyNodeInput struct {
	NodeID string
	Value  string
}
