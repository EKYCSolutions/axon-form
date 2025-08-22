package edge

type Edge struct {
	ID         string            `json:"id"`
	Label      string            `json:"label"`
	SourceNode string            `json:"source_node"`
	TargetNode string            `json:"target_node"`
	Type       EdgeType          `json:"type"`
	Conditions []EdgeCondition   `json:"conditions"`
	Configs    map[string]string `json:"config"`
}

type EdgeCondition struct {
	ID            string              `json:"id"`
	Edge          string              `json:"edge"`
	CheckNode     string              `json:"node"`
	Expression    ConditionExpression `json:"expr"`
	ExpectedValue string              `json:"value"`
}

type EdgeConditionGroup struct {
	ID          string `json:"id"`
	Conditions  string `json:"conditions"`
	NodeID      string `json:"node"`
	EdgeIDs     []string
	PostfixExpr []string
	ValidEdges  map[string]bool
}
