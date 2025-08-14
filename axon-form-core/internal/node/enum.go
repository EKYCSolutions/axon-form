package node

import (
	"encoding/json"
	"fmt"
)

type NodeType int

const (
	NodeTypeInput NodeType = iota
	NodeTypeValue
)

var nodeType = map[NodeType]string{
	NodeTypeInput: "input",
	NodeTypeValue: "value",
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
)

var nodeFieldType = map[NodeFieldType]string{
	NodeFieldTypeText:        "text",
	NodeFieldTypeNumber:      "number",
	NodeFieldTypeDatetime:    "datetime",
	NodeFieldTypeMultiSelect: "multi_select",
	NodeFieldTypeRadio:       "radio",
	NodeFieldTypeDropdown:    "dropdown",
	NodeFieldTypeCheckbox:    "checkbox",
	NodeFieldTypeFile:        "file",
	NodeFieldTypePassword:    "password",
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
	case "checkbox":
		*nft = NodeFieldTypeCheckbox
	case "file":
		*nft = NodeFieldTypeFile
	case "password":
		*nft = NodeFieldTypePassword

	default:
		return fmt.Errorf("unknown NodeFieldType: %s", s)
	}
	return nil
}
