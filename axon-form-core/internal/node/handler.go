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
			if level != "" && node.Config["level"].(string) != level {
				continue
			}

			addressNodes = append(addressNodes, *node)
		}
	}

	return &addressNodes
}

func NewNodeFromJSON(nodeJson map[string]any) (*Node, error) {
	node := Node{
		IsVisible: true,
	}

	nodeJsonBytes, err := json.Marshal(nodeJson)
	if err != nil {
		return nil, err
	}

	if err := json.Unmarshal(nodeJsonBytes, &node); err != nil {
		return nil, err
	}

	node.IsRequired = node.hasRequiredValidationRule()

	return &node, nil
}

func (n *Node) IsFieldTypeWithOptions() bool {
	for _, item := range FieldTypesWithOptions {
		if item == n.FieldType {
			return true
		}
	}
	return false
}

func (n *Node) IsAddressNode() (bool, string) {
	if n.FieldType != NodeFieldTypeAddressDropdown {
		return false, ""
	}

	level, ok := n.Config["level"].(string)
	if !ok {
		return false, ""
	}

	//
	return true, level
}

func (n *Node) hasRequiredValidationRule() bool {
	for _, rule := range n.ValidationRules {
		if rule.Type == ValidationRuleTypeRequired {
			return true
		}
	}

	return false
}

func (n *Node) GetBoolConfig(key string) bool {
	if n.Config == nil {
		return false
	}
	if v, ok := n.Config[key]; ok {
		if boolVal, ok := v.(bool); ok {
			return boolVal
		}
	}
	return false
}

func (n *Node) GetStringConfig(key string) *string {
	if n.Config == nil {
		return nil
	}
	if v, ok := n.Config[key]; ok {
		if val, ok := v.(string); ok {
			return &val
		}
	}
	return nil
}
