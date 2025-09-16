package main

import (
	"fmt"
	"os"

	"axon-form/core/internal/graph"
)

func main() {
	// Read the JSON file
	jsonData, err := os.ReadFile("/Users/panharithsun/Documents/EYKC/axon-form/axon-form-core/example/assets/example-graph-simple.json")
	if err != nil {
		fmt.Printf("Error reading JSON file: %v", err)
	}

	g := graph.Graph{}

	g.InitGraph(jsonData)

	product_type_input := graph.VerifyNodeInput{
		NodeID: "t494fub1vww8jv2",
		Value:  "Laptop",
	}

	customer_name_input := graph.VerifyNodeInput{
		NodeID: "b8mvlvxveal87lw",
		Value:  "Sambath",
	}

	email_input := graph.VerifyNodeInput{
		NodeID: "7fzhb9en55ntbeh",
		Value:  "test@gmail.com",
	}

	delivery_option_input := graph.VerifyNodeInput{
		NodeID: "byfr5rsuiidyvsq",
		Value:  "Pickup",
	}

	succ, errs := g.ValidateNode(product_type_input)
	if len(errs) == 0 {
		fmt.Println("product type validation success:", succ)
	} else {
		fmt.Println("product type validation errors:", errs)
	}
	//
	succ, errs = g.ValidateNode(customer_name_input)
	if len(errs) == 0 {
		fmt.Println("customer name input validation success:", succ)
	} else {
		fmt.Println("customer name input validation errors:", errs)
	}
	//
	succ, errs = g.ValidateNode(email_input)
	if len(errs) == 0 {
		fmt.Println("email input validation success:", succ)
	} else {
		fmt.Println("email input validation errors:", errs)
	}
	//
	succ, errs = g.ValidateNode(delivery_option_input)
	if len(errs) == 0 {
		fmt.Println("delivery option input validation success:", succ)
	} else {
		fmt.Println("delivery option input validation errors:", errs)
	}
	fmt.Println("passed delivery options")

	result := g.GetFormValue()
	fmt.Println("form value result >>", result)
}
