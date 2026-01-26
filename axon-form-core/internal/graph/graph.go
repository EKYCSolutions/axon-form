package graph

import (
	"axon-form/core/internal/address"
	"axon-form/core/internal/edge"
	"axon-form/core/internal/node"
	"axon-form/core/internal/page"
)

type EventHandler struct {
	OnNodeVisibilityChanged func(map[string]any)
	OnNodeValidatedChanged  func(map[string]any)
}

type Graph struct {
	Nodes           map[string]map[string]*node.Node
	AllNodes        map[string]*node.Node
	Edges           map[string][]*edge.Edge
	ConditionGroups map[string]*edge.EdgeConditionGroup
	Pages           map[string]*page.Page
	Address         *address.Address
	EventHandler    *EventHandler
}

type ValidateNodeInput struct {
	NodeID string
	Value  string
}
