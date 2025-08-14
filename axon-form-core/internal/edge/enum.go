package edge

import (
	"encoding/json"
	"fmt"
)

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
