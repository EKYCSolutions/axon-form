//go:build js && wasm
// +build js,wasm

package main

import (
	"syscall/js"

	"axon-form/core/internal/graph"
)

var g *graph.Graph

func initGraph(this js.Value, args []js.Value) interface{} {
	uint8Array := args[0]
	jsonData := make([]byte, uint8Array.Get("length").Int())
	js.CopyBytesToGo(jsonData, uint8Array)
	g.InitGraph(jsonData)
	return js.ValueOf(true)
}

func isNodeVisible(this js.Value, args []js.Value) interface{} {
	nodeId := args[0].String()

	isVisible, _ := g.IsNodeVisible(nodeId)
	return js.ValueOf([]interface{}{isVisible, js.ValueOf(nil)})
}

func validateNode(this js.Value, args []js.Value) interface{} {
	input := graph.ValidateNodeInput{
		NodeID: args[0].String(),
		Value:  args[1].String(),
	}

	success, err := g.ValidateNode(input)
	if err != nil {
		errMessages := make([]interface{}, len(err))
		for i, e := range err {
			errMessages[i] = e.Error()
		}
		return js.ValueOf([]interface{}{success, js.ValueOf(errMessages)})
	}
	return js.ValueOf([]interface{}{success, js.ValueOf(nil)})
}

func getFormValue(this js.Value, args []js.Value) interface{} {
	_, _, result := g.GetFormValue(false)
	return js.ValueOf([]interface{}{result, js.ValueOf(nil)})
}

func getPageFormValue(this js.Value, args []js.Value) interface{} {
	pageId := args[0].String()

	_, _, result := g.GetPageFormValue(pageId, false)
	return js.ValueOf([]interface{}{result, js.ValueOf(nil)})
}

func main() {
	js.Global().Set("initGraph", js.FuncOf(initGraph))
	js.Global().Set("isNodeVisible", js.FuncOf(isNodeVisible))
	js.Global().Set("validateNode", js.FuncOf(validateNode))
	js.Global().Set("getFormValue", js.FuncOf(getFormValue))
	js.Global().Set("getPageFormValue", js.FuncOf(getPageFormValue))
	c := make(chan struct{})
	<-c
}
