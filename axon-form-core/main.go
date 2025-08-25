package main

import (
	"axon-form/core/internal/graph"
)

func main() {
	g := graph.InitGraph("example-graph-simple.json")

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
