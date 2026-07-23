package formgraph

type NodeType string

const (
	NodeTypeInput NodeType = "input"
	NodeTypeValue NodeType = "value"
	NodeTypePage  NodeType = "page"
)

type NodeFieldType string

const (
	NodeFieldTypeText            NodeFieldType = "text"
	NodeFieldTypeNumber          NodeFieldType = "number"
	NodeFieldTypeDatetime        NodeFieldType = "datetime"
	NodeFieldTypeMultiSelect     NodeFieldType = "multi_select"
	NodeFieldTypeRadio           NodeFieldType = "radio"
	NodeFieldTypeDropdown        NodeFieldType = "dropdown"
	NodeFieldTypeAddressDropdown NodeFieldType = "address_dropdown"
	NodeFieldTypeCheckbox        NodeFieldType = "checkbox"
	NodeFieldTypeFile            NodeFieldType = "file"
	NodeFieldTypePassword        NodeFieldType = "password"
	NodeFieldTypeNone            NodeFieldType = ""
)

type ConditionOperator string

const (
	OpEquals      ConditionOperator = "equals"
	OpNotEquals   ConditionOperator = "not_equals"
	OpGreaterThan ConditionOperator = "greater_than"
	OpContains    ConditionOperator = "contains"
	OpIsEmpty     ConditionOperator = "is_empty"
	OpNotEmpty    ConditionOperator = "not_empty"
)

type ValidationRuleType string

const (
	RuleRequired  ValidationRuleType = "required"
	RuleMinLength ValidationRuleType = "min_length"
	RuleMaxLength ValidationRuleType = "max_length"
	RuleMinValue  ValidationRuleType = "min"
	RuleMaxValue  ValidationRuleType = "max"
	RulePattern   ValidationRuleType = "pattern"
)
