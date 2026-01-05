package edge

import (
	"encoding/json"
	"fmt"
)

type EdgeType int

const (
	EdgeTypeHasOption EdgeType = iota
	EdgeTypeHasField
	EdgeTypeValidates
	EdgeTypeShows
	EdgeTypeFilterBy
)

var edgeType = map[EdgeType]string{
	EdgeTypeHasOption: "has_options",
	EdgeTypeHasField:  "has_field",
	EdgeTypeValidates: "validates",
	EdgeTypeShows:     "shows",
	EdgeTypeFilterBy:  "filter_by",
}

func (et EdgeType) String() string {
	return edgeType[et]
}

func (et *EdgeType) UnmarshalJSON(data []byte) error {
	var s string
	if err := json.Unmarshal(data, &s); err != nil {
		return err
	}

	switch s {
	case "has_options":
		*et = EdgeTypeHasOption
	case "has_field":
		*et = EdgeTypeHasField
	case "validates":
		*et = EdgeTypeValidates
	case "shows":
		*et = EdgeTypeShows
	case "filter_by":
		*et = EdgeTypeFilterBy

	default:
		return fmt.Errorf("unknown EdgeType: %s", s)
	}
	return nil
}

type ConditionExpression int

const (
	ConditionExpressionEqual ConditionExpression = iota
	ConditionExpressionMoreThan
	ConditionExpressionLessThan
	ConditionExpressionMoreThanOrEqual
	ConditionExpressionLessThanOrEqual
	ConditionExpressionNotEqual
	ConditionExpressionContains
	ConditionExpressionStartsWith
	ConditionExpressionEndsWith
)

var conditionExpression = map[ConditionExpression]string{
	ConditionExpressionEqual:           "equal",
	ConditionExpressionMoreThan:        "more_than",
	ConditionExpressionLessThan:        "less_than",
	ConditionExpressionMoreThanOrEqual: "more_than_or_equal",
	ConditionExpressionLessThanOrEqual: "less_than_or_equal",
	ConditionExpressionNotEqual:        "not_equal",
	ConditionExpressionContains:        "contains",
	ConditionExpressionStartsWith:      "starts_with",
	ConditionExpressionEndsWith:        "ends_with",
}

func (ce ConditionExpression) String() string {
	return conditionExpression[ce]
}

func (ce *ConditionExpression) UnmarshalJSON(data []byte) error {
	var s string
	if err := json.Unmarshal(data, &s); err != nil {
		return err
	}

	switch s {
	case "equal":
		*ce = ConditionExpressionEqual
	case "more_than":
		*ce = ConditionExpressionMoreThan
	case "less_than":
		*ce = ConditionExpressionLessThan
	case "more_than_or_equal":
		*ce = ConditionExpressionMoreThanOrEqual
	case "less_than_or_equal":
		*ce = ConditionExpressionLessThanOrEqual
	case "not_equal":
		*ce = ConditionExpressionNotEqual
	case "contains":
		*ce = ConditionExpressionContains
	case "starts_with":
		*ce = ConditionExpressionStartsWith
	case "ends_with":
		*ce = ConditionExpressionEndsWith

	default:
		return fmt.Errorf("unknown ConditionExpression: %s", s)
	}
	return nil
}

type ConditionGroupExpression int

const (
	ConditionGroupExpressionAnd = iota
	ConditionGroupExpressionOr
	ConditionGroupExpressionNor
	ConditionGroupExpressionNot
)

var conditionGroupExpression = map[ConditionGroupExpression]string{
	ConditionGroupExpressionAnd: "and",
	ConditionGroupExpressionOr:  "or",
	ConditionGroupExpressionNor: "nor",
	ConditionGroupExpressionNot: "not",
}

func (cge ConditionGroupExpression) String() string {
	return conditionGroupExpression[cge]
}

func (cge *ConditionGroupExpression) UnmarshalJSON(data []byte) error {
	var s string
	if err := json.Unmarshal(data, &s); err != nil {
		return err
	}

	switch s {
	case "and":
		*cge = ConditionGroupExpressionAnd
	case "or":
		*cge = ConditionGroupExpressionOr
	case "nor":
		*cge = ConditionGroupExpressionNor
	case "not":
		*cge = ConditionGroupExpressionNot

	default:
		return fmt.Errorf("unknown ConditionGroupExpression: %s", s)
	}
	return nil
}
