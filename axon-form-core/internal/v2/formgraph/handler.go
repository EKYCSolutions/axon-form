package formgraph

import (
	"encoding/json"
	"errors"
	"regexp"
	"strconv"
)

// ==========================================
// Field
// ==========================================

func (g *FormGraph) AddField(id, label, fieldName, fieldType string, defaultValue any) {
	g.Fields[id] = &Field{
		ID:        id,
		Label:     label,
		FieldName: fieldName,
		Type:      fieldType,
	}
}

func (g *FormGraph) AddFieldValidation(fieldId string, rule FieldValidation) {
	g.Validations[fieldId] = append(g.Validations[fieldId], rule)
}

func (g *FormGraph) AddCondition(fieldId, dependsOn string, operator ConditionOperator, value any) {
}

// ==========================================
// Page
// ==========================================

func (g *FormGraph) AddPage(id, title string) {
	g.Pages[id] = &Page{
		ID:    id,
		Title: title,
	}
}

func (g *FormGraph) AssignFieldToPage(fieldId, pageId string) {
	g.PageFields[pageId] = append(g.PageFields[pageId], fieldId)
	g.FieldPage[fieldId] = pageId
}

// ==========================================
// State management
// ==========================================

// SetFieldValue updates fieldId's value in the graph's live form-value
// snapshot (g.Values).
//
// Returns: (true, nil) if fieldId exists and its validation rules
// (g.Validations[fieldId]) all pass for value - the value is stored
// either way. (false, nil) if fieldId exists but validation failed - use
// ValidateField(fieldId, value) separately to get the actual failure
// messages. (false, err) if fieldId is unknown.
func (g *FormGraph) SetFieldValue(fieldId string, value any) (bool, error) {
	// Check if field contain validation
	// 		if have validation, perform validation

	// Checking whether the fieldId exists
	_, exist := g.Fields[fieldId]
	if exist != true {
		return false, errors.New("fieldId is unknown")
	}

	// Checking if there is no validation
	if g.Validations[fieldId] == nil {
		g.Values[fieldId] = value
		return true, nil
	}

	fVal := g.Validations[fieldId]
	for _, val := range fVal {
		ok, err := ValidateField(val, value)
		if !ok && err != nil {
			return ok, err
		}
	}

	// Writing to g.Values
	g.Values[fieldId] = value

	// Update form value
	return true, nil
}

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
			return false, errors.New(fVal.Message)
		}
	case RuleMinLength:
		p := ConvertToInt(fVal.Param.(string))
		if len(value.(string)) < p {
			return false, errors.New(fVal.Message)
		}
	case RuleMaxLength:
		p := ConvertToInt(fVal.Param.(string))
		if len(value.(string)) > p {
			return false, errors.New(fVal.Message)
		}
	case RuleMinValue:
		p := ConvertToInt(fVal.Param.(string))
		if value.(int) < p {
			return false, errors.New(fVal.Message)
		}
	case RuleMaxValue:
		p := ConvertToInt(fVal.Param.(string))
		if value.(int) > p {
			return false, errors.New(fVal.Message)
		}
	case RulePattern:
		ok, err := regexp.MatchString(fVal.Param.(string), fVal.Message)
		if err != nil {
			panic(err)
		}
		if !ok {
			return false, errors.New(fVal.Message)
		}
	}

	return true, nil
}

// GetFormResult returns the entire form's current values, resolved and
// marshaled to a JSON string - mirrors v1's GetFormValue. Only fields that
// are both currently visible and on a currently-visible page are
// included; result format:
//
//	{
//			"field_name": "field_value",
//			....
//	}
func (g *FormGraph) GetFormValue() (string, error) {
	// Check if the current form contains any value
	if len(g.Values) == 0 {
		return "", errors.New("No data")
	}

	jsonData, err := json.Marshal(g.Values)
	if err != nil {
		return "", errors.New("Error while marshaling")
	}

	return string(jsonData), nil
}
