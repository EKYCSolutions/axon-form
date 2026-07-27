package formgraph

import (
	"encoding/json"
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
		return false, handleError("SetFieldValue", fieldUnknown)
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

	// TODO: add the condition to change the visibility of the field
	// Use the listenDep function to check whether it is true and then
	// change the visibility to be true.

	// Update form value
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
		return "", handleError("GetFormValue", dataUnknown)
	}

	jsonData, err := json.Marshal(g.Values)
	if err != nil {
		return "", handleError("GetFormValue", internalError)
	}

	return string(jsonData), nil
}

func (g *FormGraph) listenDep(source_node string) (bool, error) {
	// Check if the fieldId exists as a key in the dependents
	if g.Dependents[source_node] == nil {
		return false, handleError("listenDep", noDependents)
	}
	// Getting the target_node and the curr state of the node
	var target_node []string
	var curr []bool
	for _, dict := range g.Dependents[source_node] {
		// Nesting the for loop to interate through the list
		// of conditions and the curr status of it
		for k, v := range dict {
			target_node = append(target_node, k)
			curr = append(curr, v)
			break
		}
	}
	// Continue to checking the value
	for idx, target := range target_node {
		ok, err := g.validateDep(target, source_node)
		if err != nil {
			panic(err)
		}
		if !ok {
			return false, handleError("listenDep", incorrectValue)
		}
		g.Dependents[source_node][idx][target] = !curr[idx]
	}
	// Set the bool to opposite state which then triggers the Visibility
	return true, nil
}

func (g *FormGraph) validateDep(target_node string, source_node string) (bool, error) {
	// Checking the condition of the dependencies
	conDeps := g.Dependencies[target_node]
	if conDeps == nil {
		return false, handleError("validateDep", noDependents)
	}

	// Sanity check
	for _, cd := range conDeps {
		if cd.DependsOn == source_node {
			// Checking the value of source_node with the condition value
			// Parsing it to the function to get bool and error
			ok, err := parseOperator(g.Values[source_node], cd.Value, cd.Operator)
			if err != nil {
				return false, handleError("validateDep", incorrectOprt)
			}
			if !ok {
				return false, nil
			}
		}
	}

	return true, nil
}
