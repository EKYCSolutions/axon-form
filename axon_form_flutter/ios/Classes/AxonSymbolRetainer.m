// AxonSymbolRetainer.m
//
// In release builds, Xcode's Dead Code Stripping removes Go FFI symbols that
// are only resolved at runtime via dlsym/Dart FFI — because the linker sees no
// direct references to them. enforce_binding() is an empty Go function and
// does NOT create those references.
//
// This file declares every exported Go symbol as an extern and stores a
// function pointer to each in a __attribute__((used)) array. The compiler
// attribute prevents dead-stripping of the array, and the array's contents
// create the direct linker references needed to keep every FFI symbol alive.

#include <stdint.h>
#include <stdlib.h>

// Mirror the C signatures exported by the Go CGo layer (from libaxon.h).
// Using extern here avoids depending on the header search-path being set up
// at compile time.
extern char* ResultPtr(void);
extern int   ResultLen(void);
extern char* GetResult(void);
extern void  FreeString(char* ptr);
extern int   InitGraph(void* dataPtr, int dataLen);
extern int   AddEventListener(void* eventPtr, int eventLen, void* callbackPtr);
extern int   IsNodeVisible(void* nodeIDPtr, int nodeIDLen);
extern int   GetNodeValue(void* nodeIDPtr, int nodeIDLen);
extern int   GetChildNode(void* nodeIDPtr, int nodeIDLen);
extern int   GetOptionNodes(void* nodeIDPtr, int nodeIDLen);
extern int   ValidateAddressNode(void* nodeIDPtr, int nodeIDLen, void* valuePtr, int valueLen);
extern int   ValidateNode(void* nodeIDPtr, int nodeIDLen, void* valuePtr, int valueLen);
extern int   GetFormValue(void);
extern int   GetPageFormValue(void* pageIDPtr, int pageIDLen);
extern void  enforce_binding(void);

// __attribute__((used)) prevents the compiler/linker from dead-stripping this
// array even though no code ever reads from it.  Each entry is a direct
// function-pointer reference, so the linker must keep the target symbol.
__attribute__((used))
static void* _axon_force_symbols[] = {
    (void*)ResultPtr,
    (void*)ResultLen,
    (void*)GetResult,
    (void*)FreeString,
    (void*)InitGraph,
    (void*)AddEventListener,
    (void*)IsNodeVisible,
    (void*)GetNodeValue,
    (void*)GetChildNode,
    (void*)GetOptionNodes,
    (void*)ValidateAddressNode,
    (void*)ValidateNode,
    (void*)GetFormValue,
    (void*)GetPageFormValue,
    (void*)enforce_binding,
};
