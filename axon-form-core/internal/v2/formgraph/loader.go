package formgraph

import (
	"encoding/json"
	"fmt"
)

func (g *FormGraph) InitGraphFromJSON(jsonBytes []byte) (bool, error) {
	var graphJson map[string]any
	if err := json.Unmarshal(jsonBytes, &graphJson); err != nil {
		return false, err
	}
	//
	g.loadPages(graphJson)
	g.loadFields(graphJson)
	//
	return true, nil
}

func (g *FormGraph) loadPages(graphJson map[string]interface{}) (bool, error) {
	layoutsJson := graphJson["layout"].(map[string]interface{})
	pagesJson := layoutsJson["pages"].([]interface{})

	for _, page := range pagesJson {
		page := page.(map[string]interface{})
		//
		id := page["id"].(string)
		title := page["title"].(string)
		fieldIds := page["field_ids"].([]interface{})
		//
		g.AddPage(id, title)
		//
		for _, fieldId := range fieldIds {
			fieldId := fieldId.(string)
			g.AssignFieldToPage(fieldId, id)
		}
	}

	return true, nil
}

func (g *FormGraph) loadFields(graphJson map[string]interface{}) (bool, error) {
	nodesJson := graphJson["nodes"].([]interface{})

	for _, node := range nodesJson {
		node := node.(map[string]interface{})
		nodeType := node["type"].(string)
		//
		if nodeType != string(NodeTypeInput) {
			continue
		}
		//
		id := node["id"].(string)
		label := node["label"].(string)
		fieldName := node["field_name"].(string)
		fieldType := node["field_type"].(string)
		value := node["value"]
		//
		g.AddField(id, label, fieldName, fieldType, value)
		//
		validation_rules := node["validation_rules"]
		g.loadFieldValidations(id, validation_rules)
	}

	return true, nil
}

func (g *FormGraph) loadFieldValidations(fieldId string, validationRules interface{}) (bool, error) {
	if validationRules == nil {
		return true, nil
	}

	rules, ok := validationRules.([]interface{})
	if !ok {
		return false, fmt.Errorf("validation_rules for field %q is not an array", fieldId)
	}

	for _, r := range rules {
		rule, ok := r.(map[string]interface{})
		if !ok {
			continue
		}

		validationType, _ := rule["type"].(string)
		validationMessage, _ := rule["message"].(string)
		validationValue := rule["value"]

		g.AddValidation(fieldId, FieldValidation{
			Rule:    ValidationRuleType(validationType),
			Param:   validationValue,
			Message: validationMessage,
		})
	}

	return true, nil
}
