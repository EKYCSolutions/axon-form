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

// AddCondition and AddDependencies are the same since they both mutate g.Dependencies
// in this case we use AddCondition for readability
func (g *FormGraph) AddCondition(fieldId, dependsOnFieldId string, operator ConditionOperator, value any) {
	// Assign and append to g.Dependencies and g.Dependents
	g.Dependencies[fieldId] = append(g.Dependencies[fieldId], Condition{
		DependsOn: dependsOnFieldId,
		Operator:  operator,
		Value:     value,
	})
	//
	g.Dependents[dependsOnFieldId] = append(g.Dependents[dependsOnFieldId], fieldId)
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

func (g *FormGraph) AddPageCondition(pageId, dependsOnFieldId string, operator ConditionOperator, value any) {
	// TODO: Assign and append to g.PageDependencies
	// Status: DONE
	g.PageDependencies[pageId] = append(g.PageDependencies[pageId], Condition{
		DependsOn: dependsOnFieldId,
		Operator:  operator,
		Value:     value,
	})
}

func (g *FormGraph) AssignFieldToPage(fieldId, pageId string) {
	g.PageFields[pageId] = append(g.PageFields[pageId], fieldId)
	g.FieldPage[fieldId] = pageId

	// Handle the PageCondition through the FieldConditions
}

// ==========================================
// Validations
// ==========================================

// TODO:
// Status: DONE
func (g *FormGraph) ValidateField(fieldId, value string) (errs []error) {
	// check if field has any validation
	// if has validations, loop through each validation rule
	// run each validation (append error if there are multiple)
	// return array of errors back
	if g.Validations[fieldId] == nil {
		return nil
	}
	for _, validation := range g.Validations[fieldId] {
		ok, err := ValidateField(validation, value)
		if !ok || err != nil {
			errs = append(errs, err)
		}
	}
	if len(errs) > 0 {
		return errs
	}
	return nil
}

// ==========================================
// Visibility
// ==========================================

// TODO:
// Status: DONE
func (g *FormGraph) evaluateFieldVisibility(fieldId string) (errs []error) {
	// check if field has any dependencies via g.Dependent[fieldId]
	// if has dependencies, loop through each of the dependencies
	// retrieve the condition of each dependency via g.Dependencies[id]
	// run the condition check, if true, update the field's visibility to true via g.FieldVisibility
	if g.Dependencies[fieldId] == nil {
		return nil
	}
	for _, condition := range g.Dependencies[fieldId] {
		ok, err := ValidateCondition(condition, g.Values[fieldId])
		if !ok || err != nil {
			errs = append(errs, err)
		}
	}
	if len(errs) > 0 {
		return errs
	}
	return nil
}

// TODO:
// Status : Done
func (g *FormGraph) evaluatePageVisibility(fieldId string) (errs []error) {
	// loop through each of g.PageDependencies
	// retrieve the condition of each dependency via g.Dependencies[id]
	// run the condition check, if true, update the page's visibility to true via g.PageVisibility
	if g.PageDependencies[fieldId] == nil {
		return nil
	}
	for _, condition := range g.PageDependencies[fieldId] {
		ok, err := ValidateCondition(condition, g.Values[fieldId])
		if !ok || err != nil {
			errs = append(errs, err)
		}
	}
	if len(errs) > 0 {
		return errs
	}
	return nil
}

// TODO:
// Status : Done
func (g *FormGraph) initializeVisibility() (errs []error) {
	// run once, right after InitGraphFromJSON finishes loading pages/fields/dependencies
	// for every field_id in g.Dependencies, call g.evaluateFieldVisibility(field_id) using
	// each field's loaded default value so g.FieldVisibility reflects the loaded snapshot
	// before any SetFieldValue call happens
	// for every page_id in g.Pages, call g.evaluatePageVisibility so g.PageVisibility
	// is correct from the start too

	// Handling the FieldVisibility
	for fieldId := range g.Dependencies {
		g.FieldVisibility[fieldId] = true
		if err := g.evaluateFieldVisibility(fieldId); err != nil {
			g.FieldVisibility[fieldId] = false
			errs = append(errs, err...)
		}
	}

	// Handling the PageVisibility
	for pageId := range g.PageDependencies {
		g.PageVisibility[pageId] = true
		if err := g.evaluatePageVisibility(pageId); err != nil {
			g.PageVisibility[pageId] = false
			errs = append(errs, err...)
		}
	}

	if len(errs) > 0 {
		return errs
	}
	return nil
}

// ==========================================
// State management
// ==========================================

// TODO:
// GetPageFormValue returns only the values belonging to one page, scoped by
// g.PageFields[pageId] - mirrors v1's GetPageFormValue
// (internal/graph/handler.go:487). Needed for "save/validate just this
// page" in a multi-step form flow.
// should only include fields that are both visible (g.FieldVisibility) and
// whose page is visible (g.PageVisibility) - same rule as GetFormValue
func (g *FormGraph) GetPageFormValue(pageId string) (string, error) {
	return "", nil
}

// TODO:
// SetFormValue bulk-loads an entire form's values at once
// for each field_id/value pair in formValue,
// run the same validate -> save -> evaluate visibility
// sample input would be a map of field_name: value
//
//	e.g. {
//			"field_name_1": "value",
//			"field_name_2": "value",
//			"field_name_3": "value",
//	}
func (g *FormGraph) SetFormValue(formValue map[string]any) (success bool, errs []error) {
	return false, nil
}

// SetFieldValue updates fieldId's value in the graph's live form-value
// snapshot (g.Values).
//
// Returns: (true, nil) if fieldId exists and its validation rules
// (g.Validations[fieldId]) all pass for value - the value is stored
// either way. (false, nil) if fieldId exists but validation failed - use
// ValidateField(fieldId, value) separately to get the actual failure
// messages. (false, err) if fieldId is unknown.
func (g *FormGraph) SetFieldValue(fieldId string, value any) (success bool, err error) {
	// Checking whether the fieldId exists
	_, exist := g.Fields[fieldId]
	if !exist { // TODO: change to !exist // Status: DONE
		return false, handleError("SetFieldValue", fieldUnknown)
	}

	/*
		TODO: move this into g.ValidateField and call it here

		if g.Validations[fieldId] == nil {
			g.Values[fieldId] = value
		}

		fVal := g.Validations[fieldId]
		for _, val := range fVal {
			ok, err := ValidateField(val, value)
			if !ok && err != nil {
				return ok, err
			}
		}
	*/

	// Writing to g.Values
	g.Values[fieldId] = value

	/*
		TODO:

		call g.evaluateFieldVisibility
		call g.evaluatePageVisibility
	*/

	// // TODO: add the condition to change the visibility of the field
	// // Use the listenDep function to check whether it is true and then
	// // change the visibility to be true.2
	// if g.Dependents[fieldId] != nil {
	// 	ok, err := g.listenDep(fieldId)
	// 	if err != nil {
	// 		panic(err)
	// 	}
	// 	if !ok {
	// 		return false, nil // Continue editing this
	// 	}
	// 	ok, err = g.handleFieldVisibility(fieldId)
	// 	if !ok || err != nil {
	// 		panic("Cannot change the visibility")
	// 	}
	// }
	// Update form value
	return true, nil
}

// GetFormResult returns the entire form's current values
//
// e.g.
//
//	{
//			"field_name": "value",
//			....
//	}
func (g *FormGraph) GetFormValue() (string, error) {
	// Check if the current form contains any value
	if len(g.Values) == 0 {
		return "", handleError("GetFormValue", dataUnknown)
	}

	// TODO: filter out hidden fields. so the form values
	// should only include the fields that are visible
	jsonData, err := json.Marshal(g.Values)
	if err != nil {
		return "", handleError("GetFormValue", internalError)
	}

	return string(jsonData), nil
}
