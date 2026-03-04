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
	IsVisible   bool           `json:"is_visible"`
	IsRequired  bool           `json:"is_required"`
	//
	ValidationRules []ValidationRule `json:"validation_rules"`
	// Type any is used here because Value could be of type "string", "int", "float", "boolean"
	// Golang does not have support for union type
	Value any `json:"value"`
}
