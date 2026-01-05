package node

import (
	"encoding/json"
	"fmt"
)

type NodeType int

const (
	NodeTypeInput NodeType = iota
	NodeTypeValue
	NodeTypePage
)

var nodeType = map[NodeType]string{
	NodeTypeInput: "input",
	NodeTypeValue: "value",
	NodeTypePage:  "page",
}

func (nt NodeType) String() string {
	return nodeType[nt]
}

func (nt *NodeType) UnmarshalJSON(data []byte) error {
	var s string
	if err := json.Unmarshal(data, &s); err != nil {
		return err
	}

	switch s {
	case "input":
		*nt = NodeTypeInput
	case "value":
		*nt = NodeTypeValue
	case "page":
		*nt = NodeTypePage

	default:
		return fmt.Errorf("unknown NodeType: %s", s)
	}
	return nil
}

type NodeFieldType int

const (
	NodeFieldTypeText NodeFieldType = iota
	NodeFieldTypeNumber
	NodeFieldTypeDatetime
	NodeFieldTypeMultiSelect
	NodeFieldTypeRadio
	NodeFieldTypeDropdown
	NodeFieldTypeCheckbox
	NodeFieldTypeFile
	NodeFieldTypePassword
	NodeFieldTypeNone
	NodeFieldTypeAddressDropdown
)

var nodeFieldType = map[NodeFieldType]string{
	NodeFieldTypeText:            "text",
	NodeFieldTypeNumber:          "number",
	NodeFieldTypeDatetime:        "datetime",
	NodeFieldTypeMultiSelect:     "multi_select",
	NodeFieldTypeRadio:           "radio",
	NodeFieldTypeDropdown:        "dropdown",
	NodeFieldTypeAddressDropdown: "address_dropdown",
	NodeFieldTypeCheckbox:        "checkbox",
	NodeFieldTypeFile:            "file",
	NodeFieldTypePassword:        "password",
	NodeFieldTypeNone:            "",
}

func (nft NodeFieldType) String() string {
	return nodeFieldType[nft]
}

func (nft *NodeFieldType) UnmarshalJSON(data []byte) error {
	var s string
	if err := json.Unmarshal(data, &s); err != nil {
		return err
	}

	switch s {
	case "text":
		*nft = NodeFieldTypeText
	case "number":
		*nft = NodeFieldTypeNumber
	case "datetime":
		*nft = NodeFieldTypeDatetime
	case "multi_select":
		*nft = NodeFieldTypeMultiSelect
	case "radio":
		*nft = NodeFieldTypeRadio
	case "dropdown":
		*nft = NodeFieldTypeDropdown
	case "address_dropdown":
		*nft = NodeFieldTypeAddressDropdown
	case "checkbox":
		*nft = NodeFieldTypeCheckbox
	case "file":
		*nft = NodeFieldTypeFile
	case "password":
		*nft = NodeFieldTypePassword

	default:
		*nft = NodeFieldTypeNone
	}
	return nil
}

type ValidationRuleType int

const (
	ValidationRuleTypeRequired ValidationRuleType = iota
	ValidationRuleTypeEmail
	ValidationRuleTypeMinLength
	ValidationRuleTypeMaxLength
	ValidationRuleTypePattern
	ValidationRuleTypeMin
	ValidationRuleTypeMax
)

var validationRuleType = map[ValidationRuleType]string{
	ValidationRuleTypeRequired:  "required",
	ValidationRuleTypeEmail:     "email",
	ValidationRuleTypeMinLength: "min_length",
	ValidationRuleTypeMaxLength: "max_length",
	ValidationRuleTypePattern:   "pattern",
	ValidationRuleTypeMin:       "min",
	ValidationRuleTypeMax:       "max",
}

func (vrt ValidationRuleType) String() string {
	return validationRuleType[vrt]
}

func (vrt *ValidationRuleType) UnmarshalJSON(data []byte) error {
	var s string
	if err := json.Unmarshal(data, &s); err != nil {
		return err
	}

	switch s {
	case "required":
		*vrt = ValidationRuleTypeRequired
	case "email":
		*vrt = ValidationRuleTypeEmail
	case "min_length":
		*vrt = ValidationRuleTypeMinLength
	case "max_length":
		*vrt = ValidationRuleTypeMaxLength
	case "pattern":
		*vrt = ValidationRuleTypePattern
	case "min":
		*vrt = ValidationRuleTypeMin
	case "max":
		*vrt = ValidationRuleTypeMax

	default:
		return fmt.Errorf("unknown EdgeType: %s", s)
	}
	return nil
}
