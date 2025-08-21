package node

import (
	"encoding/json"
)

func NewNode(
	ID string,
	Label string,
	//
	NodeType NodeType,
	FieldType NodeFieldType,
	//
	ValidationRules []ValidationRule,
	//
	IsVisible bool,
) Node {
	return Node{
		ID:              ID,
		Label:           Label,
		NodeType:        NodeType,
		FieldType:       FieldType,
		ValidationRules: ValidationRules,
		IsVisible:       IsVisible,
	}
}

func GetNodeByID(id string, nodes []Node) *Node {
	var node *Node

	// Find the node of input
	for _, n := range nodes {
		if n.ID == id {
			node = &n
			break
		}
	}

	return node
}

func NewNodeFromJSON(nodeJson map[string]any) Node {
	var node Node

	nodeJsonBytes, err := json.Marshal(nodeJson)
	if err != nil {
		panic(err)
	}

	if err := json.Unmarshal(nodeJsonBytes, &node); err != nil {
		panic(err)
	}

	return node
}
