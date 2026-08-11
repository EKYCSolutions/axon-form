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

// TODO: Update this naming so it doesn't overlap with g.ValidateField
func ValidateField(fVal FieldValidation, value any) (bool, error) {
	switch ValidationRuleType(fVal.Rule) {
	case ValidationRuleRequired:
		if value == nil {
			return false, fmt.Errorf("%s", fVal.Message)
		}
	case ValidationRuleMinLength:
		p := ConvertToInt(fVal.Param.(string))
		if len(value.(string)) < p {
			return false, fmt.Errorf("%s", fVal.Message)
		}
	case ValidationRuleMaxLength:
		p := ConvertToInt(fVal.Param.(string))
		if len(value.(string)) > p {
			return false, fmt.Errorf("%s", fVal.Message)
		}
	case ValidationRuleMinValue:
		p := ConvertToInt(fVal.Param.(string))
		if value.(int) < p {
			return false, fmt.Errorf("%s", fVal.Message)
		}
	case ValidationRuleMaxValue:
		p := ConvertToInt(fVal.Param.(string))
		if value.(int) > p {
			return false, fmt.Errorf("%s", fVal.Message)
		}
	case ValidationRulePattern:
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
		return ConditionEquals, nil
	case "not_equal":
		return ConditionNotEquals, nil
	case "greater_than":
		return ConditionGreaterThan, nil
	case "contains":
		return ConditionContains, nil
	case "is_empty":
		return ConditionIsEmpty, nil
	case "not_empty":
		return ConditionNotEmpty, nil
	default:
		return "", fmt.Errorf("unknown operator: %s", expr)
	}
}

func parseOperator(value any, con_value any, oprt ConditionOperator) (bool, error) {
	switch oprt {
	case ConditionEquals:
		return value == con_value, nil
	case ConditionNotEquals:
		return !(value == con_value), nil
	case ConditionGreaterThan:
		tv, sv := ConvertToInt(value.(string)), ConvertToInt(con_value.(string))
		return tv > sv, nil
	case ConditionContains:
		if strings.Contains(value.(string), con_value.(string)) {
			return true, nil
		}
		return false, nil
	case ConditionIsEmpty:
		if value == "" || value == nil {
			return true, nil
		}
		return false, nil
	case ConditionNotEmpty:
		if value != "" || value != nil {
			return true, nil
		}
		return false, nil
	}

	return false, fmt.Errorf("unknown operator: %s", oprt)
}
