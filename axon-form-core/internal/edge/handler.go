package edge

import (
	"encoding/json"
	"regexp"

	"axon-form/core/internal/util"
)

func NewEdge(
	ID string,
	Label string,
	//
	SourceNode string,
	TargetNode string,
	//
	Conditions []EdgeCondition,
	Configs map[string]string,
) Edge {
	return Edge{
		ID:         ID,
		Label:      Label,
		SourceNode: SourceNode,
		TargetNode: TargetNode,
		Conditions: Conditions,
		Configs:    Configs,
	}
}

func GetEdgeByID(id string, edges []Edge) *Edge {
	var edge *Edge

	// Find the edge
	for _, e := range edges {
		if e.ID == id {
			edge = &e
			break
		}
	}

	return edge
}

func NewEdgeFromJSON(edgeJson map[string]any) Edge {
	var edge Edge

	edgeJsonBytes, err := json.Marshal(edgeJson)
	if err != nil {
		panic(err)
	}

	if err := json.Unmarshal(edgeJsonBytes, &edge); err != nil {
		panic(err)
	}

	return edge
}

func NewEdgeConditionGroupFromJSON(conditionGroupJson map[string]any) EdgeConditionGroup {
	var conditionGroup EdgeConditionGroup
	conditionGroup.ValidEdges = make(map[string]bool)

	conditionGroupJsonBytes, err := json.Marshal(conditionGroupJson)
	if err != nil {
		panic(err)
	}

	if err := json.Unmarshal(conditionGroupJsonBytes, &conditionGroup); err != nil {
		panic(err)
	}

	// Find all EdgeIDs in the string
	idRegexPattern := `\w{15}`
	//
	regex := regexp.MustCompile(idRegexPattern)
	match := regex.FindAllString(conditionGroup.Conditions, -1)
	//
	conditionGroup.EdgeIDs = match

	// Parse the conditions into postfix format
	conditionGroup.PostfixExpr = util.ParseInfixToPostfix(conditionGroup.Conditions)

	// Initialize edge validation map
	for _, edgeID := range conditionGroup.EdgeIDs {
		conditionGroup.ValidEdges[edgeID] = false
	}

	return conditionGroup
}
