package edge

import "encoding/json"

//	type EdgeCondition struct {
//		ID string
//		//
//		Edge      string
//		CheckNode string
//		//
//		ExpectedValue string
//		Expression    ConditionExpression
//	}
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
