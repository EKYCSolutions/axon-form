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
	g.loadDependencies(graphJson)
	//
	return true, nil
}

func (g *FormGraph) loadDependencies(graphJson map[string]any) (bool, error) {
	depJson := graphJson["edges"].([]interface{})

	for _, d := range depJson {
		dep := d.(map[string]interface{})

		// TODO:  Move edge_type == "shows" up here
		// if edge_type is not "shows", return

		// Parsing the conditions
		target_node := dep["target_node"].(string)
		edge_type := dep["type"].(string)

		// Handling the ones that contains the condition
		// "conditions": [
		//     {
		//       "id": "tfd6a0jlpdddlg7",
		//       "check_node": "pol37fda60n0p87",
		//       "edge": "rwjt2fz7sqpapnk",
		//       "expr": "equal",
		//       "value": "71q2ij6mfnfqo6e"
		//     }
		//   ]

		var condition []Condition
		var dependsOn []string
		if edge_type == "shows" {
			cons := dep["conditions"].([]interface{})

			// TODO: if conditions length is 0, return

			for _, _c := range cons {
				c := _c.(map[string]interface{})
				// Handling the operator
				oprt, err := assignOperator(c["expr"].(string))
				if err != nil {
					panic(err)
				}
				condition = append(condition, Condition{
					DependsOn: c["check_node"].(string),
					Operator:  oprt,
					Value:     c["value"],
				}) // TODO: use g.AddCondition instead
				dependsOn = append(dependsOn, c["check_node"].(string)) // TODO: move this logic into g.AddDependents instead
			}
			// Setting the value for condition
			g.Dependencies[target_node] = condition // TODO: move this logic into g.AddCondition instead
			// Building the dependents
			for _, depOn := range dependsOn {
				g.Dependents[depOn] = append(g.Dependents[depOn], target_node)
				// Setting the visibility field to be false as default
				g.VisibilityField[target_node] = false
			} // TODO: can remove this loop
		}
	}
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

		g.AddFieldValidation(fieldId, FieldValidation{
			Rule:    ValidationRuleType(validationType),
			Param:   validationValue,
			Message: validationMessage,
		})
	}

	return true, nil
}
