package formgraph

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
	return "", nil
}
