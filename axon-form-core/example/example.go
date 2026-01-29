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
		NodeID: "wu16d202mgqo6bm",
		Value:  "6zjjy5smwoi8es4",
	}

	succ, errs := g.ValidateNode(input)
	// succ, errs := g.SetFormValue({

	// })

	if len(errs) == 0 {
		fmt.Println("validation success:", succ)
	} else {
		fmt.Println("validation errors:", errs)
	}
}
