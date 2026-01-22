package main

import (
	"axon-form/core/internal/graph"
	"fmt"
	"os"
)

func onNodeVisibilityChanged(result map[string]any) {
	fmt.Println("hello: ", result)
}

func onNodeValidatedChanged(result map[string]any) {
	fmt.Println("goodbye: ", result)
}

func main() {
	// // Read the JSON file
	jsonData, err := os.ReadFile("/Users/panharithsun/Documents/EYKC/axon-form/axon-form-core/example/assets/example.json")
	if err != nil {
		fmt.Printf("Error reading JSON file: %v", err)
	}

	g := graph.Graph{}

	g.InitGraph(jsonData)
	g.AddEventListener("onNodeValidatedChanged", onNodeValidatedChanged)

	input := graph.ValidateNodeInput{
		NodeID: "pob_prov",
		Value:  "kandal",
	}

	succ, errs, childrennodes := g.ValidateAddressNode(input)
	if len(errs) == 0 {
		fmt.Println("validation success:", succ, childrennodes)
	} else {
		fmt.Println("validation errors:", errs)
	}

	// input := graph.ValidateNodeInput{
	// 	NodeID: "f_interests",
	// 	Value:  "opt_tech,dog",
	// }

	// succ, errs := g.ValidateNode(input)
	// if len(errs) == 0 {
	// 	fmt.Println("validation success:", succ)
	// } else {
	// 	fmt.Println("validation errors:", errs)
	// }

	_, err, result := g.GetFormValue()
	fmt.Println("get form value validation errors:", err)
	fmt.Println("get form value result:", result)

}
