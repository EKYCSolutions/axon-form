//go:build cgo

package main

/*
#include <stdint.h>
#include <stdlib.h>
#include <stdio.h>

typedef void (*dart_json_callback)(char* json_data);

static void invoke_callback(void* callback_ptr, char* json_data) {
    if (callback_ptr == NULL) return;
    dart_json_callback cb = (dart_json_callback)callback_ptr;
    cb(json_data);
}

static void debug_print(char* str) {
    printf("[Native] %s\n", str);
}
*/
import "C"
import (
	"axon-form/core/internal/graph"
	"encoding/json"
	"fmt"
	"strings"
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

// joinErrs collapses a slice of validation errors into a single message so that
// callers surface every failure instead of only the first one. Returns nil
// (JSON null) when there are no errors.
func joinErrs(errs []error) any {
	if len(errs) == 0 {
		return nil
	}
	msgs := make([]string, len(errs))
	for i, e := range errs {
		msgs[i] = e.Error()
	}
	return strings.Join(msgs, "; ")
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

//export FreeString
func FreeString(ptr *C.char) {
	if ptr == nil {
		return
	}
	C.free(unsafe.Pointer(ptr))
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

	data := map[string]any{
		"pages": g.Pages,
		"nodes": g.Nodes,
		"edges": g.Edges,
	}

	return setJSONResult([]any{true, nil, data})
}

//export AddEventListener
func AddEventListener(
	eventPtr unsafe.Pointer,
	eventLen C.int,
	callbackPtr unsafe.Pointer,
) C.int {
	if g == nil {
		return setJSONResult([]string{"graph not initialized"})
	}

	event := goString(eventPtr, eventLen)

	cEvent := C.CString(fmt.Sprintf("AddEventListener called for: %s", event))
	C.debug_print(cEvent)
	C.free(unsafe.Pointer(cEvent))

	callback := func(data map[string]any) {
		jsonData, _ := json.Marshal(data)
		// Convert Go string -> C string
		cData := C.CString(string(jsonData))
		// We DO NOT free cData here because the Dart NativeCallable.listener is asynchronous.
		// If we free it here, Dart receives a pointer to freed memory.
		// We transfer ownership to Dart, which must free it after reading.

		// Call the C helper, which calls the Dart function
		C.invoke_callback(callbackPtr, cData)
	}

	g.AddEventListener(event, callback)

	data := map[string]any{
		"status": "added event listener",
	}

	setJSONResult([]any{true, nil, data})
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

//export GetNodeValue
func GetNodeValue(nodeIDPtr unsafe.Pointer, nodeIDLen C.int) C.int {
	if g == nil {
		return setJSONResult([]string{"graph not initialized"})
	}

	nodeID := goString(nodeIDPtr, nodeIDLen)
	nodeValue, err := g.GetNodeValue(nodeID)

	if err != nil {
		setJSONResult([]any{false, err.Error(), nil})
		return 0
	}

	data := map[string]any{
		"value": nodeValue,
	}

	return setJSONResult([]any{true, nil, data})
}

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
		setJSONResult([]any{false, err.Error(), nil})
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

	errOut := joinErrs(errs)

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

	errOut := joinErrs(errs)

	data := map[string]bool{
		"isValid": success,
	}

	return setJSONResult([]any{success, errOut, data})
}

/* -------------------- form values -------------------- */

//export GetFormValue
func GetFormValue(ignoreErrors C.int) C.int {
	if g == nil {
		setResult([]byte(`null`))
		return 0
	}

	var errOut any
	success, err, result := g.GetFormValue(ignoreErrors != 0)
	if err != nil {
		errOut = err.Error()
	}

	data := map[string]any{
		"result": result,
	}

	return setJSONResult([]any{success, errOut, data})

}

//export GetPageFormValue
func GetPageFormValue(pageIDPtr unsafe.Pointer, pageIDLen C.int) C.int {
	if g == nil {
		setResult([]byte(`null`))
		return 0
	}

	var errOut any
	pageID := goString(pageIDPtr, pageIDLen)
	success, err, result := g.GetPageFormValue(pageID, false)
	if err != nil {
		errOut = err.Error()
	}

	data := map[string]any{
		"result": result,
	}

	return setJSONResult([]any{success, errOut, data})
}

/* -------------------- required -------------------- */

//export enforce_binding
func enforce_binding() {}

func main() {}
