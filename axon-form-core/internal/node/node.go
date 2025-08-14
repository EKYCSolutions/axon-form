package node

type ValidationRule struct {
	Type    string `json:"type"`
	Value   string `json:"value"`
	Message string `json:"message"`
}

type Node struct {
	ID              string           `json:"id"`
	Label           string           `json:"label"`
	NodeType        NodeType         `json:"type"`
	FieldType       NodeFieldType    `json:"field_type"`
	ValidationRules []ValidationRule `json:"validation_rules"`
}
