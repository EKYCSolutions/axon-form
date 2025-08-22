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
	for i := range nodes {
		if nodes[i].ID == id {
			return &nodes[i]
		}
	}

	return nil
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
