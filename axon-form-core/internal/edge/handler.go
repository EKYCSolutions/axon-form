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

func NewEdgeFromJSON(edgeJson map[string]any) (*Edge, error) {
	var edge Edge

	edgeJsonBytes, err := json.Marshal(edgeJson)
	if err != nil {
		return nil, err
	}

	if err := json.Unmarshal(edgeJsonBytes, &edge); err != nil {
		return nil, err
	}

	return &edge, nil
}

func NewEdgeConditionGroupFromJSON(conditionGroupJson map[string]any) (*EdgeConditionGroup, error) {
	var conditionGroup EdgeConditionGroup
	conditionGroup.ValidEdges = make(map[string]bool)

	conditionGroupJsonBytes, err := json.Marshal(conditionGroupJson)
	if err != nil {
		return nil, err
	}

	if err := json.Unmarshal(conditionGroupJsonBytes, &conditionGroup); err != nil {
		return nil, err
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

	return &conditionGroup, nil
}

func GetEdgeByNode(nodeId string, nodeType string, edges map[string][]*Edge) *Edge {
	var foundEdge *Edge

	// Find the edge
	for _, edgeList := range edges {
		for _, e := range edgeList {
			if nodeType == "target" && e.TargetNode == nodeId {
				foundEdge = e
				break
			} else if nodeType == "source" && e.SourceNode == nodeId {
				foundEdge = e
				break
			}
		}
	}

	return foundEdge
}
