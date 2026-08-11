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
	ConditionEquals      ConditionOperator = "equals"
	ConditionNotEquals   ConditionOperator = "not_equals"
	ConditionGreaterThan ConditionOperator = "greater_than"
	ConditionContains    ConditionOperator = "contains"
	ConditionIsEmpty     ConditionOperator = "is_empty"
	ConditionNotEmpty    ConditionOperator = "not_empty"
)

type ValidationRuleType string

const (
	ValidationRuleRequired  ValidationRuleType = "required"
	ValidationRuleMinLength ValidationRuleType = "min_length"
	ValidationRuleMaxLength ValidationRuleType = "max_length"
	ValidationRuleMinValue  ValidationRuleType = "min"
	ValidationRuleMaxValue  ValidationRuleType = "max"
	ValidationRulePattern   ValidationRuleType = "pattern"
)
