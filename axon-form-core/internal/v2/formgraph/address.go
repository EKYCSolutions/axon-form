package formgraph

// address.go covers cascading address_dropdown fields (e.g. country -> state
// -> city), where selecting one dropdown dynamically populates the options
// of the next. v1 implements this as a full subsystem of live option nodes
// and edges that get created/destroyed as the user picks values
// (internal/graph/handler.go: InitAddress, updateAddressNodeOptions,
// refreshAddressOptionNodesAndEdges, clearExistingAddressOptions,
// createAddressOption, getAddressParentNode, clearAddressOptionNode,
// getAddressChildrenNodeIds, getAddressList, ValidateAddressNode).
// None of this has a v2 counterpart yet. Field.Config's "level" (see
// types.go:15-18) is the only hint v2 intends to support this.
//
// TODO: scope this as its own project once the core field/page visibility
// + validation loop (evaluateFieldVisibility, evaluatePageVisibility,
// ValidateField) is working end-to-end - this is the single largest
// remaining v1 feature area, not a small gap.

// TODO:
// InitAddress loads the address reference dataset (country/state/city
// hierarchy) the address_dropdown fields resolve options against - mirrors
// v1's InitAddress (internal/graph/handler.go:194), which parses a
// dedicated addressJson payload separate from the form graph JSON.
func (g *FormGraph) InitAddress(addressJson map[string]any) (bool, error) {
	return false, nil
}

// TODO:
// RefreshAddressOptions recomputes the selectable options for an
// address_dropdown field after a parent level's value changes (e.g.
// picking a country repopulates the state dropdown's options) - mirrors
// v1's updateAddressNodeOptions/refreshAddressOptionNodesAndEdges
// (internal/graph/handler.go:1047, 1069). In v2 this should write into
// g.Fields[fieldId].Config["options"] (see options.go's Option type)
// rather than creating/deleting graph nodes.
func (g *FormGraph) RefreshAddressOptions(fieldId string) (bool, error) {
	return false, nil
}

// TODO:
// getAddressList resolves the list of address entries available at a given
// level (e.g. "state") beneath a parent field's currently selected value -
// mirrors v1's getAddressList (internal/graph/handler.go:1211). Needs an
// AddressInfo-equivalent type ported from v1's address package once the
// reference dataset shape is decided.
func (g *FormGraph) getAddressList(fieldId string, level string) ([]any, error) {
	return nil, nil
}

// TODO:
// ValidateAddressField validates a submitted address_dropdown value against
// the currently resolved option list for that field/level, similar to
// ValidateOptionValue in options.go, but scoped to address fields - mirrors
// v1's ValidateAddressNode (internal/graph/handler.go:791), which also
// returns suggestion strings on a near-miss.
func (g *FormGraph) ValidateAddressField(fieldId string, value any) (bool, []error, []string) {
	return false, nil, nil
}
