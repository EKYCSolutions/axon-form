package formgraph

// condition_groups.go covers grouped AND/OR logic across multiple
// conditions on a single edge - v1's parseConditionGroups/
// ValidateConditionGroup/UpdateConditionGroupEdgeValid
// (internal/graph/handler.go:115, 851, 841). v2's Condition/Dependencies
// model today is a flat list, implicitly AND-only (evaluateFieldVisibility
// requires every condition to pass). There is currently no way in v2 to
// express "show this field if A equals X OR B equals Y".
//
// TODO: before implementing, confirm whether any existing forms actually
// use grouped/OR conditions (check graphJson exports for a
// "condition_groups" key, or grep axon-form-console for group-related
// edge/condition UI) - if nothing uses it yet, this may not need porting.

// ConditionGroup represents a set of conditions combined with AND/OR logic,
// as opposed to a plain []Condition which is always AND-only.
// TODO: add this type to types.go once the grouping structure is confirmed
// against actual graphJson exports
// type ConditionGroup struct {
// 	Operator   string // "and" | "or"
// 	Conditions []Condition
// }

// TODO:
// loadConditionGroups parses whatever "condition_groups" structure the
// graph JSON export contains (see v1's parseConditionGroups,
// internal/graph/handler.go:115, for the source shape) and attaches them to
// the relevant field/page, likely as an alternative to (or wrapping)
// g.Dependencies.
func (g *FormGraph) loadConditionGroups(graphJson map[string]any) (bool, error) {
	return false, nil
}

// TODO:
// evaluateConditionGroup evaluates one ConditionGroup against g.Values,
// applying AND/OR per the group's operator - mirrors v1's
// ValidateConditionGroup (internal/graph/handler.go:851). Called from
// evaluateFieldVisibility/evaluatePageVisibility once fields/pages can
// carry condition groups instead of (or alongside) flat Condition lists.
func (g *FormGraph) evaluateConditionGroup(group any, values map[string]any) (bool, error) {
	return false, nil
}
