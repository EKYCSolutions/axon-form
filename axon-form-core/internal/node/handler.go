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

var FieldTypesWithOptions = []NodeFieldType{
	NodeFieldTypeCheckbox,
	NodeFieldTypeDropdown,
	NodeFieldTypeMultiSelect,
	NodeFieldTypeRadio,
}

func GetNodeByID(id string, nodes map[string]*Node) *Node {
	node, ok := nodes[id]

	if !ok {
		return nil
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

func IsFieldTypeWithOptions(nodeType NodeFieldType) bool {
	for _, item := range FieldTypesWithOptions {
		if item == nodeType {
			return true
		}
	}
	return false
}
