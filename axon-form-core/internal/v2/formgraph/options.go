package formgraph

// options.go covers dropdown/radio/multi_select fields, whose choices are
// authored as separate "value"-type nodes connected to the field via
// "has_options" edges (see FormBuilderProvider.tsx addValueNode/addEdge).
// v1 keeps these as live graph nodes looked up per-validation
// (internal/graph/handler.go: getOptionNodeByValue, validateOptionNode,
// updateMultiSelectValue, updateSingleSelectOptionValue, GetOptionNodes).
// v2 should instead resolve them once at load time into static per-field
// config, since option lists don't participate in the visibility/dependency
// graph - see Field.Config in types.go.

// Option is one selectable choice for a dropdown/radio/multi_select field.
// TODO: add this type to types.go once the shape is confirmed against the
// actual "value" node JSON (label/value, see FormBuilderProvider.tsx:459-465)
// type Option struct {
// 	Label string
// 	Value string
// }

// TODO:
// loadOptions parses "has_options" edges out of graphJson (alongside
// loadDependencies's "shows" handling in loader.go) and resolves each
// edge's target "value" node into an Option appended to
// g.Fields[source_node].Config["options"].
// needs a lookup of value-type nodes by id (loadFields currently skips
// them entirely via the NodeTypeInput filter, loader.go:108) - build that
// lookup here or thread it in from loadFields.
func (g *FormGraph) loadOptions(graphJson map[string]any) (bool, error) {
	return false, nil
}

// TODO:
// ValidateOptionValue checks a submitted value against
// g.Fields[fieldId].Config["options"] instead of a graph edge lookup -
// mirrors v1's validateOptionNode (internal/graph/handler.go:589) minus the
// edge traversal.
// for multi_select fields, split the submitted value on "," and validate
// each piece independently - mirrors updateMultiSelectValue
// (internal/graph/handler.go:637)
// check g.Fields[fieldId].Config for an "allow_custom_option" flag before
// rejecting a value that isn't in the options list - mirrors v1's
// ALLOW_CUSTOM_OPTION_KEY escape hatch
func (g *FormGraph) ValidateOptionValue(fieldId string, value any) (bool, error) {
	return false, nil
}

// TODO:
// GetFieldOptions returns the resolved options list for a field, read
// straight from g.Fields[fieldId].Config["options"] - mirrors v1's
// GetOptionNodes (internal/graph/handler.go:983) but without a graph
// lookup, since options are static config in v2.
func (g *FormGraph) GetFieldOptions(fieldId string) ([]any, error) {
	return nil, nil
}
