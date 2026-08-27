package formgraph

import (
	"errors"
	"fmt"
)

// TODO: constant messages for error handling
var pageUnknown = errors.New("Error: page is unknown")
var fieldUnknown = errors.New("Error: field is unknown")
var dataUnknown = errors.New("Error: data is unknown")
var internalError = errors.New("Error: internal server error")
var noDependents = errors.New("Error: no dependencies found")
var incorrectValue = errors.New("Error: value is incorrect")
var incorrectOprt = errors.New("Error: operator is not listed")
var errPageVisibility = errors.New("Error: page is not visible, cannot display data")

// Customized error return
func handleError(funcName string, errorMsg error) error {
	return fmt.Errorf("At %s: %v", funcName, errorMsg)
}
