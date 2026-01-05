//go:build cgo

package main

/*
#include <stdint.h>
#include <stdlib.h>
*/
import "C"

import (
	"axon-form/core/internal/graph"
	"encoding/json"
	"fmt"
	"unsafe"
)

var (
	g          *graph.Graph
	lastResult []byte
)

/* -------------------- helpers -------------------- */

func setResult(b []byte) {
	// lastResult = append([]byte(nil), b...)
	lastResult = make([]byte, len(b))
	copy(lastResult, b)
}

func setJSONResult(v any) C.int {
	b, err := json.Marshal(v)
	if err != nil {
		setResult([]byte(fmt.Sprintf(`["marshal error","%s"]`, err.Error())))
		return 0
	}
	setResult(b)
	return 1
}

func goString(ptr unsafe.Pointer, len C.int) string {
	if ptr == nil || len == 0 {
		return ""
	}
	return string(C.GoBytes(ptr, len))
}

/* -------------------- result access -------------------- */

//export ResultPtr
func ResultPtr() *C.char {
	if len(lastResult) == 0 {
		return nil
	}
	return (*C.char)(unsafe.Pointer(&lastResult[0]))
}

//export ResultLen
func ResultLen() C.int {
	return C.int(len(lastResult))
}

//export GetResult
func GetResult() *C.char {
	return C.CString(string(lastResult)) // caller must free
}

/* -------------------- graph lifecycle -------------------- */

//export InitGraph
func InitGraph(dataPtr unsafe.Pointer, dataLen C.int) C.int {
	if dataPtr == nil || dataLen == 0 {
		setResult([]byte(`["invalid input",null]`))
		return 0
	}

	if g == nil {
		g = &graph.Graph{}
	}

	jsonData := C.GoBytes(dataPtr, dataLen)
	g.InitGraph(jsonData)

	return 1
}

//export InitAddress
func InitAddress(dataPtr unsafe.Pointer, dataLen C.int) C.int {
	if dataPtr == nil || dataLen == 0 {
		setResult([]byte(`["invalid input",null]`))
		return 0
	}

	jsonData := C.GoBytes(dataPtr, dataLen)
	g.InitAddress(jsonData)

	return 1
}

/* -------------------- node visibility -------------------- */

//export IsNodeVisible
func IsNodeVisible(nodeIDPtr unsafe.Pointer, nodeIDLen C.int) C.int {
	if g == nil {
		return setJSONResult([]string{"graph not initialized"})
	}

	nodeID := goString(nodeIDPtr, nodeIDLen)
	nodeVisible, err := g.IsNodeVisible(nodeID)

	if err != nil {
		setJSONResult([]any{false, err.Error(), nodeVisible})
		return 0
	}

	return setJSONResult([]any{true, nil, nodeVisible})
}

/* -------------------- node retrieval (NEW) -------------------- */

//export GetChildNode
func GetChildNode(nodeIDPtr unsafe.Pointer, nodeIDLen C.int) C.int {
	if g == nil {
		setResult([]byte(`["graph not initialized",null]`))
		return 0
	}

	nodeID := goString(nodeIDPtr, nodeIDLen)
	node, err := g.GetChildNode(nodeID)

	if err != nil {
		setJSONResult([]any{false, err.Error(), nil})
		return 0
	}

	data := map[string]any{
		"node": node,
	}

	return setJSONResult([]any{true, nil, data})
}

//export GetOptionNodes
func GetOptionNodes(nodeIDPtr unsafe.Pointer, nodeIDLen C.int) C.int {
	if g == nil {
		setResult([]byte(`["graph not initialized",null]`))
		return 0
	}

	nodeID := goString(nodeIDPtr, nodeIDLen)
	nodes, err := g.GetOptionNodes(nodeID)

	if err != nil {
		setJSONResult([]byte(`["graph not initialized",null]`))
		return 0
	}

	data := map[string]any{
		"options": nodes,
	}

	return setJSONResult([]any{true, nil, data})
}

/* -------------------- validation -------------------- */

//export ValidateAddressNode
func ValidateAddressNode(
	nodeIDPtr unsafe.Pointer, nodeIDLen C.int,
	valuePtr unsafe.Pointer, valueLen C.int,
) C.int {
	if g == nil {
		setResult([]byte(`["graph not initialized",null]`))
		return 0
	}

	input := graph.ValidateNodeInput{
		NodeID: goString(nodeIDPtr, nodeIDLen),
		Value:  goString(valuePtr, valueLen),
	}

	success, errs, nodeIds := g.ValidateAddressNode(input)

	var errOut any
	if errs != nil {
		errOut = errs[0].Error()
	}

	data := map[string]any{
		"isValid": success,
		"nodeIds": nodeIds,
	}

	return setJSONResult([]any{success, errOut, data})
}

//export ValidateNode
func ValidateNode(
	nodeIDPtr unsafe.Pointer, nodeIDLen C.int,
	valuePtr unsafe.Pointer, valueLen C.int,
) C.int {
	if g == nil {
		setResult([]byte(`["graph not initialized",null]`))
		return 0
	}

	input := graph.ValidateNodeInput{
		NodeID: goString(nodeIDPtr, nodeIDLen),
		Value:  goString(valuePtr, valueLen),
	}

	success, errs := g.ValidateNode(input)

	var errOut any
	if errs != nil {
		errOut = errs[0].Error()
	}

	data := map[string]bool{
		"isValid": success,
	}

	return setJSONResult([]any{success, errOut, data})
}

/* -------------------- form values -------------------- */

//export GetFormValue
func GetFormValue() C.int {
	if g == nil {
		setResult([]byte(`null`))
		return 0
	}

	result, err := g.GetFormValue()
	if err != nil {
		return setJSONResult(err)
	}

	return setJSONResult(result)
}

//export GetPageFormValue
func GetPageFormValue(pageIDPtr unsafe.Pointer, pageIDLen C.int) C.int {
	if g == nil {
		setResult([]byte(`null`))
		return 0
	}

	pageID := goString(pageIDPtr, pageIDLen)
	result, err := g.GetPageFormValue(pageID)
	if err != nil {
		return setJSONResult(err)
	}

	return setJSONResult(result)
}

/* -------------------- required -------------------- */

//export enforce_binding
func enforce_binding() {}

func main() {}
