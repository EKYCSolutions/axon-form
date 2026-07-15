//go:build js && wasm
// +build js,wasm

package main

import (
	"encoding/json"
	"syscall/js"

	"axon-form/core/internal/graph"
)

var g *graph.Graph

// jsonResult mirrors the [success, error, data] tuple produced by the FFI
// bridge (ffi_wrapper.go) so the Dart side can share the same parsing logic
// regardless of platform.
func jsonResult(success bool, errMsg any, data any) js.Value {
	b, err := json.Marshal([]any{success, errMsg, data})
	if err != nil {
		b, _ = json.Marshal([]any{false, err.Error(), nil})
	}
	return js.ValueOf(string(b))
}

func initGraph(this js.Value, args []js.Value) interface{} {
	uint8Array := args[0]
	jsonData := make([]byte, uint8Array.Get("length").Int())
	js.CopyBytesToGo(jsonData, uint8Array)

	if g == nil {
		g = &graph.Graph{}
	}
	g.InitGraph(jsonData)

	data := map[string]any{
		"pages": g.Pages,
		"nodes": g.Nodes,
		"edges": g.Edges,
	}
	return jsonResult(true, nil, data)
}

func addEventListener(this js.Value, args []js.Value) interface{} {
	if g == nil {
		return jsonResult(false, "graph not initialized", nil)
	}

	event := args[0].String()
	callback := args[1]

	g.AddEventListener(event, func(data map[string]any) {
		jsonData, _ := json.Marshal(data)
		callback.Invoke(string(jsonData))
	})

	return jsonResult(true, nil, map[string]any{"status": "added event listener"})
}

func isNodeVisible(this js.Value, args []js.Value) interface{} {
	if g == nil {
		return jsonResult(false, "graph not initialized", nil)
	}

	nodeId := args[0].String()
	isVisible, err := g.IsNodeVisible(nodeId)
	if err != nil {
		return jsonResult(false, err.Error(), isVisible)
	}
	return jsonResult(true, nil, isVisible)
}

func getNodeValue(this js.Value, args []js.Value) interface{} {
	if g == nil {
		return jsonResult(false, "graph not initialized", nil)
	}

	nodeId := args[0].String()
	nodeValue, err := g.GetNodeValue(nodeId)
	if err != nil {
		return jsonResult(false, err.Error(), nil)
	}

	return jsonResult(true, nil, map[string]any{"value": nodeValue})
}

func validateNode(this js.Value, args []js.Value) interface{} {
	if g == nil {
		return jsonResult(false, "graph not initialized", nil)
	}

	input := graph.ValidateNodeInput{
		NodeID: args[0].String(),
		Value:  args[1].String(),
	}

	success, errs := g.ValidateNode(input)

	var errOut any
	if errs != nil {
		errOut = errs[0].Error()
	}

	return jsonResult(success, errOut, map[string]bool{"isValid": success})
}

func validateAddressNode(this js.Value, args []js.Value) interface{} {
	if g == nil {
		return jsonResult(false, "graph not initialized", nil)
	}

	input := graph.ValidateNodeInput{
		NodeID: args[0].String(),
		Value:  args[1].String(),
	}

	success, errs, nodeIds := g.ValidateAddressNode(input)

	var errOut any
	if errs != nil {
		errOut = errs[0].Error()
	}

	return jsonResult(success, errOut, map[string]any{
		"isValid": success,
		"nodeIds": nodeIds,
	})
}

func getChildNode(this js.Value, args []js.Value) interface{} {
	if g == nil {
		return jsonResult(false, "graph not initialized", nil)
	}

	nodeId := args[0].String()
	node, err := g.GetChildNode(nodeId)
	if err != nil {
		return jsonResult(false, err.Error(), nil)
	}

	return jsonResult(true, nil, map[string]any{"node": node})
}

func getOptionNodes(this js.Value, args []js.Value) interface{} {
	if g == nil {
		return jsonResult(false, "graph not initialized", nil)
	}

	nodeId := args[0].String()
	nodes, err := g.GetOptionNodes(nodeId)
	if err != nil {
		return jsonResult(false, err.Error(), nil)
	}

	return jsonResult(true, nil, map[string]any{"options": nodes})
}

func getFormValue(this js.Value, args []js.Value) interface{} {
	if g == nil {
		return jsonResult(false, "graph not initialized", nil)
	}

	ignoreErrors := args[0].Bool()
	success, err, result := g.GetFormValue(ignoreErrors)

	var errOut any
	if err != nil {
		errOut = err.Error()
	}

	return jsonResult(success, errOut, map[string]any{"result": result})
}

func getPageFormValue(this js.Value, args []js.Value) interface{} {
	if g == nil {
		return jsonResult(false, "graph not initialized", nil)
	}

	pageId := args[0].String()
	success, err, result := g.GetPageFormValue(pageId, false)

	var errOut any
	if err != nil {
		errOut = err.Error()
	}

	return jsonResult(success, errOut, map[string]any{"result": result})
}

func main() {
	// Expose everything under a single `AxonForm` namespace on the global
	// object instead of setting bare global names — a bare `addEventListener`
	// or `getChildNode` would silently shadow built-in DOM/window APIs.
	axonForm := js.Global().Get("Object").New()

	axonForm.Set("initGraph", js.FuncOf(initGraph))
	axonForm.Set("addEventListener", js.FuncOf(addEventListener))
	axonForm.Set("isNodeVisible", js.FuncOf(isNodeVisible))
	axonForm.Set("getNodeValue", js.FuncOf(getNodeValue))
	axonForm.Set("validateNode", js.FuncOf(validateNode))
	axonForm.Set("validateAddressNode", js.FuncOf(validateAddressNode))
	axonForm.Set("getChildNode", js.FuncOf(getChildNode))
	axonForm.Set("getOptionNodes", js.FuncOf(getOptionNodes))
	axonForm.Set("getFormValue", js.FuncOf(getFormValue))
	axonForm.Set("getPageFormValue", js.FuncOf(getPageFormValue))

	// Setting this last on the global object is the readiness signal the
	// Dart side polls for.
	js.Global().Set("AxonForm", axonForm)

	select {}
}
