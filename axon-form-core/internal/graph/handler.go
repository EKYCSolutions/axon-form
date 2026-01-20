package graph

import (
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"regexp"
	"strconv"
	"strings"

	"axon-form/core/internal/address"
	"axon-form/core/internal/edge"
	"axon-form/core/internal/node"
	"axon-form/core/internal/page"
	"axon-form/core/internal/util"
)

// ==========================================
// Initialization Methods
// ==========================================

func (g *Graph) InitGraph(jsonBytes []byte) (bool, error) {
	var graphJson map[string]interface{}
	if err := json.Unmarshal(jsonBytes, &graphJson); err != nil {
		return false, err
	}

	g.initializeMaps()
	g.InitNodeGroup("inputs")
	g.InitNodeGroup("values")
	g.InitNodeGroup("pages")

	if err := g.parsePages(graphJson); err != nil {
		return false, err
	}
	if err := g.parseNodes(graphJson); err != nil {
		return false, err
	}
	if err := g.parseEdges(graphJson); err != nil {
		return false, err
	}
	if err := g.parseConditionGroups(graphJson); err != nil {
		return false, err
	}

	return g.InitAddress(graphJson["address"].(map[string]interface{}))
}

func (g *Graph) initializeMaps() {
	g.Nodes = make(map[string]map[string]*node.Node)
	g.Edges = make(map[string][]*edge.Edge)
	g.ConditionGroups = make(map[string]*edge.EdgeConditionGroup)
	g.Pages = make(map[string]*page.Page)
}

func (g *Graph) parsePages(graphJson map[string]interface{}) error {
	layoutsJson := graphJson["layout"].(map[string]interface{})
	pagesJson := layoutsJson["pages"].([]interface{})

	for _, p := range pagesJson {
		pageJson := p.(map[string]any)
		newPage, err := page.NewPageFromJSON(pageJson)
		if err != nil {
			return err
		}
		g.Pages[newPage.ID] = newPage
	}
	return nil
}

func (g *Graph) parseNodes(graphJson map[string]interface{}) error {
	nodesJson := graphJson["nodes"].([]interface{})
	for _, n := range nodesJson {
		nodeJson := n.(map[string]any)
		newNode, err := node.NewNodeFromJSON(nodeJson)
		if err != nil {
			return err
		}
		switch newNode.NodeType {
		case node.NodeTypeInput:
			g.Nodes["inputs"][newNode.ID] = newNode
		case node.NodeTypeValue:
			g.Nodes["values"][newNode.ID] = newNode
		case node.NodeTypePage:
			g.Nodes["pages"][newNode.ID] = newNode
		}
	}
	return nil
}

func (g *Graph) parseEdges(graphJson map[string]interface{}) error {
	edgesJson := graphJson["edges"].([]interface{})
	for _, e := range edgesJson {
		edgeJson := e.(map[string]any)
		newEdge, err := edge.NewEdgeFromJSON(edgeJson)
		if err != nil {
			return err
		}
		g.Edges[newEdge.SourceNode] = append(g.Edges[newEdge.SourceNode], newEdge)
	}
	return nil
}

func (g *Graph) parseConditionGroups(graphJson map[string]interface{}) error {
	conditionGroupsJson := graphJson["condition_groups"].([]interface{})
	for _, e := range conditionGroupsJson {
		conditionGroupJson := e.(map[string]any)
		conditionGroup, err := edge.NewEdgeConditionGroupFromJSON(conditionGroupJson)
		if err != nil {
			return err
		}
		g.ConditionGroups[conditionGroup.ID] = conditionGroup
	}
	return nil
}

func (g *Graph) InitAddress(addressJson map[string]interface{}) (bool, error) {
	a := address.Address{}
	jsonBytes, err := json.Marshal(addressJson)
	if err != nil {
		return false, err
	}
	a.InitAddress(jsonBytes)
	g.Address = &a

	inputNodes := g.Nodes["inputs"]
	provinceInputs := node.GetAddressNode(inputNodes, "province")

	provinces, err := g.Address.GetProvinces()

	if err != nil {
		return false, err
	}

	for _, pInput := range *provinceInputs {
		g.refreshAddressOptionNodesAndEdges(provinces, pInput)
	}
	return true, nil
}

func (g *Graph) InitNodeGroup(group string) {
	if _, ok := g.Nodes[group]; !ok {
		g.Nodes[group] = make(map[string]*node.Node)
	}
}

// ==========================================
// Event Listener Methods
// ==========================================

func (g *Graph) AddEventListener(event string, callback func(map[string]any)) {
	if g.EventHandler == nil {
		g.EventHandler = &EventHandler{}
	}

	switch event {
	case "onNodeVisibilityChanged":
		g.EventHandler.OnNodeVisibilityChange = callback
	case "onNodeValidatedChanged":
		g.EventHandler.OnNodeValidatedChanged = callback
	}
}

// ==========================================
// Form Value Methods
// ==========================================

func (g Graph) GetPageFormValue(pageID string) (string, error) {
	result := make(map[string]any)

	foundPage := page.GetPageByID(pageID, g.Pages)

	for _, id := range foundPage.FieldIDs {
		n, ok := g.Nodes["inputs"][id]
		if !ok {
			return "", errors.New("Node not found")
		}
		isAddressNode, level := node.IsAddressNode(n)
		if isAddressNode {
			parentNode, err := g.GetParentNode(n.ID)
			if level != "province" && err != nil {
				return "", err
			}

			addressList, err := g.getAddressList(parentNode, level)

			if err != nil {
				return "", err
			}

			for _, addr := range addressList {
				if addr.Key == n.Value {
					result[n.FieldName] = addr
				}
			}
		} else {
			result[n.FieldName] = n.Value
		}
	}

	jsonBytes, err := json.Marshal(result)
	if err != nil {
		return "", err
	}

	return string(jsonBytes), nil
}

func (g Graph) GetFormValue() (bool, error, string) {
	result := make(map[string]any)

	inputNodes := g.Nodes["inputs"]

	for _, n := range inputNodes {
		hasRequired := false
		for _, rule := range n.ValidationRules {
			if rule.Type == node.ValidationRuleTypeRequired {
				hasRequired = true
				break
			}
		}

		hasValue := n.Value != nil

		if !hasRequired && !hasValue {
			continue
		}

		isAddressNode, level := node.IsAddressNode(n)
		if isAddressNode {
			parentNode, err := g.GetParentNode(n.ID)
			if level != "province" && err != nil {
				return false, err, ""
			}

			addressList, err := g.getAddressList(parentNode, level)

			if err != nil {
				return false, err, ""
			}

			for _, addr := range addressList {
				if addr.Key == n.Value {
					result[n.FieldName] = addr
				}
			}
		} else {
			result[n.FieldName] = n.Value
		}
	}

	jsonBytes, err := json.Marshal(result)
	if err != nil {
		log.Fatal(err)
	}

	return true, nil, string(jsonBytes)
}

// ==========================================
// Node Validation and Update Methods
// ==========================================

func (g Graph) IsNodeVisible(nodeID string) (bool, error) {
	n, ok := g.Nodes["inputs"][nodeID]
	if !ok {
		return false, errors.New("Node not found")
	}

	return n.IsVisible, nil
}

func (g Graph) validateOptionNode(parentNodeId string, optionNodeId string) (*node.Node, error) {
	// Check that the option node exists
	optionNode, ok := g.Nodes["values"][optionNodeId]

	if !ok {
		return nil, errors.New("Option node not found")
	}

	var foundEdge *edge.Edge

	tEdges := g.Edges[parentNodeId]

	// Verify that there is an edge from the current node to the selected option node
	for _, e := range tEdges {
		if e.TargetNode == optionNodeId {
			foundEdge = e
			break
		}
	}

	if foundEdge == nil {
		return nil, errors.New("Invalid option node")
	}
	return optionNode, nil
}

func (g Graph) updateNodeValue(input ValidateNodeInput, n *node.Node) (bool, error) {
	if !node.IsFieldTypeWithOptions(n.FieldType) {
		n.Value = input.Value
		return true, nil
	}

	// Skip option node validation when the node id is empty
	optionNodeId := input.Value
	if len(optionNodeId) == 0 {
		n.Value = optionNodeId
		return true, nil
	}

	if n.FieldType == node.NodeFieldTypeMultiSelect {
		return g.updateMultiSelectValue(input, n)
	}

	return g.updateSingleSelectOptionValue(input, n)
}

func (g Graph) updateMultiSelectValue(input ValidateNodeInput, n *node.Node) (bool, error) {
	optionNodeIds := strings.Split(input.Value, ",")
	var selectedOptionValues []string

	for _, id := range optionNodeIds {
		id = strings.TrimSpace(id)
		if id == "" {
			continue
		}

		optionNode, err := g.validateOptionNode(n.ID, id)

		if err != nil {
			return false, err
		}

		if val, ok := optionNode.Value.(string); ok {
			selectedOptionValues = append(selectedOptionValues, val)
		} else {
			// Fallback: convert to string representation only if it's not a string
			selectedOptionValues = append(selectedOptionValues, fmt.Sprintf("%v", optionNode.Value))
		}
	}

	n.Value = selectedOptionValues
	return true, nil
}

func (g Graph) updateSingleSelectOptionValue(input ValidateNodeInput, n *node.Node) (bool, error) {
	optionNodeId := input.Value
	optionNode, err := g.validateOptionNode(n.ID, optionNodeId)
	if err != nil {
		return false, err
	}

	n.Value = optionNode.Value
	return true, nil
}

func (g Graph) ValidateNode(input ValidateNodeInput) (bool, []error) {
	n, ok := g.Nodes["inputs"][input.NodeID]

	if !ok {
		return false, []error{errors.New("Node not found")}
	}

	// 1. Validate Field Rules
	_, fieldErrors := g.ValidateNodeValidationRules(input, *n)
	if len(fieldErrors) > 0 {
		return false, fieldErrors
	}
	fmt.Println("passed [Validate Field Rules]")

	// 2. Evaluate Dependent Logic (Edges & Groups)
	if err := g.evaluateDependentLogic(input); err != nil {
		return false, []error{err}
	}
	fmt.Println("passed [Evaluate Dependent Logic (Edges & Groups)]")

	// 3. Update Node Value & Fire Event
	if _, err := g.updateNodeValue(input, n); err != nil {
		return false, []error{err}
	}
	fmt.Println("passed [Update Node Value & Fire Event]")

	g.EventHandler.OnNodeValidatedChanged(map[string]any{"nodeID": input.NodeID})

	return true, nil
}

func (g Graph) evaluateDependentLogic(input ValidateNodeInput) error {
	// Evaluate Edges
	foundEdges := g.Edges[input.NodeID]
	for _, e := range foundEdges {
		if e.Type != edge.EdgeTypeShows {
			continue
		}

		_, edgeErrors := g.ValidateEdgeConditions(*e, input)
		if len(edgeErrors) > 0 {
			continue
		}

		nodeToUpdate, ok := g.Nodes["inputs"][e.TargetNode]
		if !ok {
			return errors.New("Node not found")
		}
		nodeToUpdate.IsVisible = true

		g.UpdateConditionGroupEdgeValid(e.ID)
	}

	// Evaluate Condition Groups
	for _, cg := range g.ConditionGroups {
		if g.ValidateConditionGroup(*cg) {
			n, ok := g.Nodes["inputs"][cg.NodeID]
			if !ok {
				return errors.New("Node not found")
			}
			n.IsVisible = true
		}
	}
	return nil
}

func (g Graph) ValidateAddressNode(input ValidateNodeInput) (bool, []error, []string) {
	valid, valErr := g.ValidateNode(input)

	if !valid && len(valErr) > 0 {
		return false, valErr, []string{}
	}

	fmt.Println("input node: ", input.NodeID)
	fmt.Println("input value: ", input.Value)

	n, ok := g.Nodes["inputs"][input.NodeID]
	if !ok {
		return false, []error{errors.New("Input node not found")}, []string{}
	}

	_, ok = g.Nodes["values"][input.Value]
	if !ok {
		return false, []error{errors.New("Value node not found")}, []string{}
	}

	g.updateAddressNodeOptions(*n)

	childrenNodes, err := g.getAddressChildrenNodeIds(*n)

	if err != nil {
		return false, []error{err}, []string{}
	}

	return valid, nil, childrenNodes
}

// ==========================================
// Condition and Rule Validation Methods
// ==========================================

func (g Graph) UpdateConditionGroupEdgeValid(edgeID string) {
	for _, cg := range g.ConditionGroups {
		for _, id := range cg.EdgeIDs {
			if id == edgeID {
				cg.ValidEdges[edgeID] = true
			}
		}
	}
}

func (g Graph) ValidateConditionGroup(cg edge.EdgeConditionGroup) bool {
	return util.EvalPostfix(cg.PostfixExpr, cg.ValidEdges)
}

func (g Graph) ValidateNodeValidationRules(i ValidateNodeInput, n node.Node) ([]bool, []error) {
	fieldValid := make([]bool, len(n.ValidationRules))
	var errorMessages []error

	for idx, rule := range n.ValidationRules {
		passValidation, err := g.ValidateRule(rule, i.Value)

		if !passValidation {
			errorMessages = append(errorMessages, err)
		}

		fieldValid[idx] = passValidation
	}

	return fieldValid, errorMessages
}

func (g Graph) ValidateEdgeConditions(e edge.Edge, i ValidateNodeInput) ([]bool, []error) {
	edgeValid := make([]bool, len(e.Conditions))
	var errorMessages []error

	for idx, condition := range e.Conditions {
		passCondition, err := g.ValidateCondition(condition, i.Value)

		if !passCondition {
			errorMessages = append(errorMessages, err)
		}

		edgeValid[idx] = passCondition

	}

	return edgeValid, errorMessages
}

func (g Graph) ValidateRule(r node.ValidationRule, v string) (bool, error) {
	switch r.Type {
	case node.ValidationRuleTypeRequired:
		if len(v) > 0 {
			return true, nil
		}
		return false, errors.New(r.Message)

	case node.ValidationRuleTypeMinLength:
		minLength, err := strconv.Atoi(r.Value)
		if err != nil {
			return false, err
		}
		return len(v) >= minLength, errors.New(r.Message)

	case node.ValidationRuleTypeMaxLength:
		maxLength, err := strconv.Atoi(r.Value)
		if err != nil {
			return false, err
		}
		return len(v) <= maxLength, errors.New(r.Message)

	case node.ValidationRuleTypeMin:
		return v >= r.Value, errors.New(r.Message)

	case node.ValidationRuleTypeMax:
		return v <= r.Value, errors.New(r.Message)

	case node.ValidationRuleTypePattern:
		regex := r.Value
		match, _ := regexp.MatchString(regex, v)
		return match, errors.New("value does not pass regex validation")

	case node.ValidationRuleTypeEmail:
		emailRegex := `^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$`
		match, _ := regexp.MatchString(emailRegex, v)
		return match, errors.New(r.Message)

	default:
		return false, nil
	}
}

func (g Graph) ValidateCondition(c edge.EdgeCondition, v string) (bool, error) {
	switch c.Expression {
	case edge.ConditionExpressionEqual:
		return v == c.ExpectedValue, errors.New("condition not met: equal")

	case edge.ConditionExpressionMoreThan:
		return v > c.ExpectedValue, errors.New("condition not met: more than")

	case edge.ConditionExpressionLessThan:
		return v < c.ExpectedValue, errors.New("condition not met: less than")

	case edge.ConditionExpressionMoreThanOrEqual:
		return v >= c.ExpectedValue, errors.New("condition not met: more than or equal")

	case edge.ConditionExpressionLessThanOrEqual:
		return v <= c.ExpectedValue, errors.New("condition not met: less than or equal")

	case edge.ConditionExpressionNotEqual:
		return v != c.ExpectedValue, errors.New("condition not met: not equal")

	case edge.ConditionExpressionContains:
		return strings.Contains(v, c.ExpectedValue), errors.New("condition not met: contains")

	case edge.ConditionExpressionStartsWith:
		return strings.HasPrefix(v, c.ExpectedValue), errors.New("condition not met: starts with")

	case edge.ConditionExpressionEndsWith:
		return strings.HasSuffix(v, c.ExpectedValue), errors.New("condition not met: ends with")
	}

	return false, nil
}

// ==========================================
// Options and Navigation Methods
// ==========================================

func (g Graph) GetOptionNodes(nodeId string) (*[]node.Node, error) {
	var optionNodes []node.Node

	edges := g.Edges[nodeId]

	for _, e := range edges {
		if e.Type == edge.EdgeTypeHasOption {
			n, ok := g.Nodes["values"][e.TargetNode]
			if !ok {
				return nil, errors.New("Node not found")
			}
			optionNodes = append(optionNodes, *n)
		}
	}

	return &optionNodes, nil
}

func (g Graph) GetParentNode(nodeId string) (*node.Node, error) {
	var n *node.Node

	tEdge := edge.GetEdgeByNode(nodeId, "source", g.Edges)

	if tEdge == nil {
		return n, errors.New("Parent node not found")
	}

	n, ok := g.Nodes["inputs"][tEdge.TargetNode]

	if !ok {
		return n, errors.New("Child Node not found")
	}

	return n, nil
}

func (g Graph) GetChildNode(nodeId string) (*node.Node, error) {
	var n *node.Node

	tEdge := edge.GetEdgeByNode(nodeId, "target", g.Edges)

	if tEdge == nil {
		return n, errors.New("Child node not found")
	}

	n, ok := g.Nodes["inputs"][tEdge.SourceNode]

	if !ok {
		return n, errors.New("Child Node not found")
	}

	return n, nil
}

// ==========================================
// Address Specific Methods
// ==========================================

func (g Graph) updateAddressNodeOptions(parentNode node.Node) (bool, error) {

	e := edge.GetEdgeByNode(parentNode.ID, "target", g.Edges)

	if e == nil {
		return false, errors.New("Edge not found")
	}

	n, ok := g.Nodes["inputs"][e.SourceNode]
	if !ok {
		return false, errors.New("Node not found")
	}

	_, level := node.IsAddressNode(n)
	addressList, err := g.getAddressList(&parentNode, level)
	if err != nil {
		return false, errors.New("Address not found")
	}
	g.refreshAddressOptionNodesAndEdges(addressList, *n)
	return true, nil
}

func (g Graph) refreshAddressOptionNodesAndEdges(addressList []address.AddressInfo, sourceNode node.Node) (bool, error) {
	const ID_LENGTH = 15

	// 1. Clear existing relations
	if err := g.clearExistingAddressOptions(sourceNode); err != nil {
		return false, err
	}

	// 2. Create new options
	for idx, addr := range addressList {
		if err := g.createAddressOption(sourceNode, addr, idx, ID_LENGTH); err != nil {
			return false, err
		}
	}

	return true, nil
}

func (g Graph) clearExistingAddressOptions(sourceNode node.Node) error {
	if len(g.Edges[sourceNode.ID]) == 0 {
		return nil
	}

	nodesToRefresh := []string{sourceNode.ID}
	ids, err := g.getAddressChildrenNodeIds(sourceNode)
	if err != nil {
		return err
	}

	nodesToRefresh = append(nodesToRefresh, ids...)
	for _, id := range nodesToRefresh {
		n, ok := g.Nodes["inputs"][id]
		if !ok {
			return errors.New("Node not found during option cleanup")
		}
		g.clearAddressOptionNode(*n)
	}
	return nil
}

func (g Graph) createAddressOption(sourceNode node.Node, addr address.AddressInfo, idx int, idLength int) error {
	vNodeId, err := util.GenerateID(idLength)
	if err != nil {
		return err
	}

	vNode := node.Node{
		ID:              *vNodeId,
		Order:           idx,
		Label:           fmt.Sprintf("%s-%s", addr.NameKh, addr.NameEn),
		NodeType:        node.NodeTypeValue,
		FieldType:       node.NodeFieldTypeNone,
		FieldName:       "",
		IsVisible:       false,
		ValidationRules: nil,
		Value:           addr.Key,
	}

	pEdgeId, err := util.GenerateID(idLength)
	if err != nil {
		return err
	}

	pEdge := edge.Edge{
		ID:         *pEdgeId,
		Label:      fmt.Sprintf("option-%s", addr.Key),
		SourceNode: sourceNode.ID,
		TargetNode: *vNodeId,
		Type:       edge.EdgeTypeHasOption,
		Conditions: nil,
		Configs:    nil,
	}

	g.Nodes["values"][*vNodeId] = &vNode
	g.Edges[sourceNode.ID] = append(g.Edges[sourceNode.ID], &pEdge)
	return nil
}

func (g Graph) getAddressParentNode(childNode node.Node) (*node.Node, error) {
	edge := edge.GetEdgeByNode(childNode.ID, "source", g.Edges)

	if edge == nil {
		return nil, errors.New("Edge not found")
	}

	parentNode, ok := g.Nodes["inputs"][edge.TargetNode]
	if !ok {
		return nil, errors.New("Node not found")
	}

	return parentNode, nil
}

func (g Graph) clearAddressOptionNode(n node.Node) {
	var filteredEdges []*edge.Edge

	for _, e := range g.Edges[n.ID] {
		if e.Type == edge.EdgeTypeHasOption {
			// Remove old address options
			delete(g.Nodes["values"], e.TargetNode)
		} else {
			// Filter only edges that are not has_option type
			filteredEdges = append(filteredEdges, e)
		}
	}

	g.Edges[n.ID] = filteredEdges
}

func (g Graph) getAddressChildrenNodeIds(parentNode node.Node) ([]string, error) {
	var childrenNodeIds []string
	//
	// In the address hierarchy, parent and child nodes are connected by a FILTER_BY edge.
	// The source node of this edge is the child, and the target node is the parent,
	// indicating that the child's options are filtered based on the parent's selection.
	//
	tEdge := edge.GetEdgeByNode(parentNode.ID, "target", g.Edges)

	if tEdge == nil {
		return []string{}, nil
	}
	//

	childNode, ok := g.Nodes["inputs"][tEdge.SourceNode]
	if !ok {
		return []string{}, errors.New("Node not found")
	}
	//
	childrenNodeIds = append(childrenNodeIds, childNode.ID)
	ids, err := g.getAddressChildrenNodeIds(*childNode)

	if err != nil {
		return []string{}, err
	}

	childrenNodeIds = append(childrenNodeIds, ids...)
	//
	return childrenNodeIds, nil
}

func (g Graph) getAddressList(parentNode *node.Node, level string) ([]address.AddressInfo, error) {
	addressList := []address.AddressInfo{}

	switch level {
	case "province":
		provinces, err := g.Address.GetProvinces()

		if err != nil {
			return []address.AddressInfo{}, err
		}

		addressList = provinces
	case "district":
		provinceNode := parentNode
		provinceKey, _ := provinceNode.Value.(string)

		districts, err := g.Address.GetDistricts(provinceKey)

		if err != nil {
			return []address.AddressInfo{}, err
		}

		addressList = districts
	case "commune":
		districtNode := parentNode
		districtKey, _ := parentNode.Value.(string)

		provinceNode, err := g.getAddressParentNode(*districtNode)
		if err != nil {
			return []address.AddressInfo{}, err
		}

		provinceKey := provinceNode.Value.(string)

		communes, err := g.Address.GetCommunes(provinceKey, districtKey)

		if err != nil {
			return []address.AddressInfo{}, err
		}

		addressList = communes
	case "village":
		communeNode := parentNode
		communeKey, _ := parentNode.Value.(string)

		districtNode, err := g.getAddressParentNode(*communeNode)
		if err != nil {
			return []address.AddressInfo{}, err
		}

		districtKey := districtNode.Value.(string)

		provinceNode, err := g.getAddressParentNode(*districtNode)
		if err != nil {
			return []address.AddressInfo{}, err
		}

		provinceKey := provinceNode.Value.(string)

		villages, err := g.Address.GetVillages(provinceKey, districtKey, communeKey)

		if err != nil {
			return []address.AddressInfo{}, err
		}

		addressList = villages
	}

	return addressList, nil
}
