package formgraph

// formgraph is a stateless, snapshot-driven form engine: visibility and
// validation are always computed fresh from a form_values map the caller
// passes in, rather than mutated in place and announced via events. This is
// a deliberate departure from v1 (internal/graph) - see internal/sample.py
// for the reference design this package ports into Go.

// Field is a single input on the form.
type Field struct {
	ID        string
	Label     string
	Type      string
	FieldName string
	// FieldName and Config carry real JSON data (the external key form
	// values are keyed by, and field_type-specific options like an address
	// dropdown's "level") that sample.py's toy fields didn't need.
	Config map[string]any
}

// Condition is one entry in a field's or page's dependency list, e.g.
// "shipping_address depends on same_as_billing equals false".
type Condition struct {
	DependsOn string
	Operator  ConditionOperator
	Value     any
}

// FieldValidation is one validation rule attached to a field. Message is an
// optional author-provided override; when empty, ValidateField falls back
// to a generated message.
type FieldValidation struct {
	Rule    ValidationRuleType
	Param   any
	Message string
}

// Page is a single page/step of the form.
type Page struct {
	ID          string
	Title       string
	Description string
}

type FormGraph struct {
	Fields      map[string]*Field
	FieldOrder  []string // declaration order, for deterministic render order
	Validations map[string][]FieldValidation
	Values      map[string]any // form values

	// TODO: add VisibilityPage and VisibilityField
	// Type : map[string]bool

	Dependencies map[string][]Condition     // field_id -> conditions it depends on
	Dependents   map[string]map[string]bool // depends_on -> set of dependent field_ids

	Pages            map[string]*Page
	PageOrder        []string // explicit sequence of page_ids
	PageFields       map[string][]string
	FieldPage        map[string]string // reverse lookup: field_id -> page_id
	PageDependencies map[string][]Condition
}

func NewFormGraph() *FormGraph {
	g := &FormGraph{}
	g.initMaps()
	return g
}

func (g *FormGraph) initMaps() {
	g.Fields = make(map[string]*Field)
	g.Validations = make(map[string][]FieldValidation)
	g.Dependencies = make(map[string][]Condition)
	g.Dependents = make(map[string]map[string]bool)
	g.Pages = make(map[string]*Page)
	g.PageFields = make(map[string][]string)
	g.FieldPage = make(map[string]string)
	g.PageDependencies = make(map[string][]Condition)
	g.Values = make(map[string]any)
}
