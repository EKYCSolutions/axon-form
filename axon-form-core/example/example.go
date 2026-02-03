package main

import (
	"axon-form/core/internal/graph"
	"fmt"
	"os"
)

func onNodeVisibilityChanged(result map[string]any) {
	fmt.Println("onNodeVisibilityChanged: ", result)
}

func onNodeValidatedChanged(result map[string]any) {
	// fmt.Println("goodbye: ", result)
}

func main() {
	// // Read the JSON file
	jsonData, err := os.ReadFile("assets/example.json")
	if err != nil {
		fmt.Printf("Error reading JSON file: %v", err)
	}

	g := graph.Graph{}

	g.InitGraph(jsonData)
	g.AddEventListener("onNodeValidatedChanged", onNodeValidatedChanged)
	g.AddEventListener("onNodeVisibilityChanged", onNodeVisibilityChanged)

	input := graph.ValidateNodeInput{
		NodeID: "pob_prov",
		Value:  "tboung_khmum",
	}

	// succ, errs := g.ValidateNode(input)
	succ, errs, _ := g.ValidateAddressNode(input)
	// succ, errs := g.SetFormValue({

	// })

	children, err := g.GetOptionNodes("pob_distric")

	fmt.Println("children: ", children)

	if err != nil {
		fmt.Println("error: ", err)
	}

	if len(errs) == 0 {
		fmt.Println("validation success:", succ)
	} else {
		fmt.Println("validation errors:", errs)
	}
}
