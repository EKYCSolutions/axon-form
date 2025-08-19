package util

import "fmt"

type MultiError struct {
	Errors []error
}

func (m MultiError) Error() string {
	msg := "multiple errors:\n"
	for i, err := range m.Errors {
		msg += fmt.Sprintf("  %d. %s\n", i+1, err)
	}
	return msg
}
