package node

type ValidationRule struct {
	Type    ValidationRuleType `json:"type"`
	Value   string             `json:"value"`
	Message string             `json:"message"`
}

type Node struct {
	ID          string         `json:"id"`
	Order       int            `json:"order"`
	Label       string         `json:"label"`
	NodeType    NodeType       `json:"type"`
	FieldType   NodeFieldType  `json:"field_type"`
	FieldName   string         `json:"field_name"`
	Placeholder string         `json:"placeholder"`
	Config      map[string]any `json:"config"`
	//
	IsVisible       bool
	ValidationRules []ValidationRule `json:"validation_rules"`
	// Type any is used here because Value could be of type "string", "int", "float", "boolean"
	// Golang does not have support for union type
	Value any `json:"value"`
}

func (n *Node) IsRequired() bool {
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
