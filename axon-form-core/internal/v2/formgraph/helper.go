package formgraph

import (
	"fmt"
	"regexp"
	"strconv"
	"strings"
)

// List of functions to declutter the functions in the main files
func ConvertToInt(param string) int {
	p, err := strconv.Atoi(param)
	if err != nil {
		panic(err)
	}
	return p
}

func ValidateField(fVal FieldValidation, value any) (bool, error) {
	switch ValidationRuleType(fVal.Rule) {
	case RuleRequired:
		if value == nil {
			return false, fmt.Errorf("%s", fVal.Message)
		}
	case RuleMinLength:
		p := ConvertToInt(fVal.Param.(string))
		if len(value.(string)) < p {
			return false, fmt.Errorf("%s", fVal.Message)
		}
	case RuleMaxLength:
		p := ConvertToInt(fVal.Param.(string))
		if len(value.(string)) > p {
			return false, fmt.Errorf("%s", fVal.Message)
		}
	case RuleMinValue:
		p := ConvertToInt(fVal.Param.(string))
		if value.(int) < p {
			return false, fmt.Errorf("%s", fVal.Message)
		}
	case RuleMaxValue:
		p := ConvertToInt(fVal.Param.(string))
		if value.(int) > p {
			return false, fmt.Errorf("%s", fVal.Message)
		}
	case RulePattern:
		ok, err := regexp.MatchString(fVal.Param.(string), value.(string))
		if err != nil {
			panic(err)
		}
		if !ok {
			return false, fmt.Errorf("%s", fVal.Message)
		}
	}

	return true, nil
}

func assignOperator(expr string) (ConditionOperator, error) {
	switch expr {
	case "equal":
		return OpEquals, nil
	case "not_equal":
		return OpNotEquals, nil
	case "greater_than":
		return OpGreaterThan, nil
	case "contains":
		return OpContains, nil
	case "is_empty":
		return OpIsEmpty, nil
	case "not_empty":
		return OpNotEmpty, nil
	default:
		return "", fmt.Errorf("unknown operator: %s", expr)
	}
}

func parseOperator(value any, con_value any, oprt ConditionOperator) (bool, error) {
	switch oprt {
	case OpEquals:
		return value == con_value, nil
	case OpNotEquals:
		return !(value == con_value), nil
	case OpGreaterThan:
		tv, sv := ConvertToInt(value.(string)), ConvertToInt(con_value.(string))
		return tv > sv, nil
	case OpContains:
		if strings.Contains(value.(string), con_value.(string)) {
			return true, nil
		}
		return false, nil
	case OpIsEmpty:
		if value == "" || value == nil {
			return true, nil
		}
		return false, nil
	case OpNotEmpty:
		if value != "" || value != nil {
			return true, nil
		}
		return false, nil
	}

	return false, fmt.Errorf("unknown operator: %s", oprt)
}
