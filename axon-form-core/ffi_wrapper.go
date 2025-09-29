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

func setResult(b []byte) {
	lastResult = append([]byte(nil), b...)
}

//export GetResult
func GetResult() *C.char {
	return C.CString(string(lastResult))
}

//export InitGraph
func InitGraph(dataPtr unsafe.Pointer, dataLen C.int) C.int {
	if dataLen == 0 || dataPtr == nil {
		setResult([]byte(`["invalid input", null]`))
		return 0
	}

	jsonData := C.GoBytes(dataPtr, dataLen)
	tempGraph := graph.InitGraph(jsonData)
	g = &tempGraph

	return 1
}

//export IsNodeVisible
func IsNodeVisible(nodeIDPtr unsafe.Pointer, nodeIDLen C.int) C.int {
	if g == nil {
		setResult([]byte(`["graph not initialized", null]`))
		return 0
	}

	nodeID := string(C.GoBytes(nodeIDPtr, nodeIDLen))
	isVisible := g.IsNodeVisible(nodeID)

	if isVisible {
		return 1
	}

	return 0
}

//export ValidateNode
func ValidateNode(nodeIDPtr unsafe.Pointer, nodeIDLen C.int, valuePtr unsafe.Pointer, valueLen C.int) C.int {
	if g == nil {
		setResult([]byte(`["graph not initialized", null]`))
		return 0
	}

	nodeID := string(C.GoBytes(nodeIDPtr, nodeIDLen))
	value := string(C.GoBytes(valuePtr, valueLen))

	input := graph.VerifyNodeInput{
		NodeID: nodeID,
		Value:  value,
	}

	success, errs := g.ValidateNode(input)

	var errIface interface{}
	if errs != nil {
		msgs := make([]string, len(errs))
		for i, e := range errs {
			msgs[i] = e.Error()
		}
		errIface = msgs
	}

	out := []interface{}{success, errIface}
	b, _ := json.Marshal(out)
	setResult(b)
	return 1
}

//export GetFormValue
func GetFormValue() C.int {
	if g == nil {
		setResult([]byte(`null`))
		return 0
	}

	val := g.GetFormValue()
	switch v := any(val).(type) {
	case []byte:
		setResult(v)
	case string:
		setResult([]byte(v))
	default:
		b, err := json.Marshal(v)
		if err != nil {
			setResult([]byte(fmt.Sprintf(`"marshal error: %s"`, err.Error())))
			return 0
		}
		setResult(b)
	}

	return 1
}

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

//export enforce_binding
func enforce_binding() {}

func main() {}
