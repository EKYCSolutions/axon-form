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
	NodeFieldTypeAddressDropdown,
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

func GetAddressNode(nodes map[string]*Node, level string) *[]Node {
	var addressNodes []Node

	for _, node := range nodes {
		if node.FieldType == NodeFieldTypeAddressDropdown {
			addressNodes = append(addressNodes, *node)
		}
	}

	return &addressNodes
}

func NewNodeFromJSON(nodeJson map[string]any) (*Node, error) {
	var node Node

	nodeJsonBytes, err := json.Marshal(nodeJson)
	if err != nil {
		return nil, err
	}

	if err := json.Unmarshal(nodeJsonBytes, &node); err != nil {
		return nil, err
	}

	return &node, nil
}

func IsFieldTypeWithOptions(nodeType NodeFieldType) bool {
	for _, item := range FieldTypesWithOptions {
		if item == nodeType {
			return true
		}
	}
	return false
}

func IsAddressNode(node *Node) (bool, string) {
	if node.FieldType != NodeFieldTypeAddressDropdown {
		return false, ""
	}

	level, ok := node.Config["level"].(string)
	if !ok {
		return false, ""
	}

	//
	return true, level
}
