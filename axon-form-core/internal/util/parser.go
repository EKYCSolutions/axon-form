package util

import (
	"strings"
)

var expressions = map[string]int{
	"AND": 1,
	"OR":  2,
	"NOR": 3,
	"NOT": 4,
}

func isOperator(s string) bool {
	_, ok := expressions[s]
	return ok
}

/*
Convert Condition String into Postfix format

Example: 	Input = A AND B AND ( C OR D )

	Output = A B C D OR AND AND
*/

func ParseInfixToPostfix(s string) []string {
	var output []string
	var stack []string

	tokens := strings.Fields(s)

	for _, token := range tokens {
		switch {
		case isOperator(token):
			// push operator onto stack
			stack = append(stack, token)

		case token == "(":
			stack = append(stack, token)

		case token == ")":
			// pop until "("
			for len(stack) > 0 && stack[len(stack)-1] != "(" {
				output = append(output, stack[len(stack)-1])
				stack = stack[:len(stack)-1]
			}
			// discard the "("
			stack = stack[:len(stack)-1]

		default:
			// operand → goes directly to output
			output = append(output, token)
		}
	}

	// pop remaining operators
	for len(stack) > 0 {
		output = append(output, stack[len(stack)-1])
		stack = stack[:len(stack)-1]
	}

	return output
}

/*
Evaluate the postfix-formatted expression

Example 1: 	Input = tokens: A B AND, values: {A: true, B: true}

	Output = true

Example 2: 	Input = tokens: C D AND, values: {C: false, D: true}

	Output = false
*/
func EvalPostfix(tokens []string, values map[string]bool) bool {
	var stack []bool

	for _, token := range tokens {
		switch token {
		case "AND":
			b := stack[len(stack)-1]
			a := stack[len(stack)-2]
			stack = stack[:len(stack)-2]
			stack = append(stack, a && b)
		case "OR":
			b := stack[len(stack)-1]
			a := stack[len(stack)-2]
			stack = stack[:len(stack)-2]
			stack = append(stack, a || b)
		case "NOR":
			b := stack[len(stack)-1]
			a := stack[len(stack)-2]
			stack = stack[:len(stack)-2]
			stack = append(stack, !(a || b))
		default:
			// operand → lookup its value
			stack = append(stack, values[token])
		}
	}

	return stack[0]
}
