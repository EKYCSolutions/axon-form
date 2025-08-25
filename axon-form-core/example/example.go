package main

import (
	"fmt"
	"os"

	"axon-form/core/internal/graph"
)

func main() {
	// Read the JSON file
	jsonData, err := os.ReadFile("example/assets/example-graph-simple.json")
	fmt.Println("json length >>", len(jsonData))
	if err != nil {
		fmt.Printf("Error reading JSON file: %v", err)
	}

	g := graph.InitGraph(jsonData)

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

	g.ValidateNode(product_type_input)
	g.ValidateNode(customer_name_input)
	g.ValidateNode(email_input)
	g.ValidateNode(delivery_option_input)

	g.GetFormValue()
}
