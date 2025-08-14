package edge

type EdgeCondition struct {
	ID            string              `json:"id"`
	Edge          string              `json:"edge"`
	CheckNode     string              `json:"node"`
	ExpectedValue string              `json:"value"`
	Expression    ConditionExpression `json:"expr"`
}

type Edge struct {
	ID         string            `json:"id"`
	Label      string            `json:"label"`
	SourceNode string            `json:"source_node"`
	TargetNode string            `json:"target_node"`
	Conditions []EdgeCondition   `json:"conditions"`
	Configs    map[string]string `json:"config"`
}
