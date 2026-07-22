package formgraph

// ==========================================
// Field setup
// ==========================================

func (g *FormGraph) AddField(id, label, fieldName, fieldType string, defaultValue any) {
	g.Fields[id] = &Field{
		ID:        id,
		Label:     label,
		FieldName: fieldName,
		Type:      fieldType,
	}
}

func (g *FormGraph) AddValidation(fieldId string, rule FieldValidation) {
	g.Validations[fieldId] = append(g.Validations[fieldId], rule)
}

func (g *FormGraph) AddCondition(fieldId, dependsOn string, operator ConditionOperator, value any) {
}

// ==========================================
// Page setup
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
