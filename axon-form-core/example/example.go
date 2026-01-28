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
	jsonData, err := os.ReadFile("/Users/panharithsun/Documents/EYKC/axon-form/axon-form-core/example/assets/gdi-online-sample.json")
	if err != nil {
		fmt.Printf("Error reading JSON file: %v", err)
	}

	g := graph.Graph{}

	g.InitGraph(jsonData)
	g.AddEventListener("onNodeValidatedChanged", onNodeValidatedChanged)
	g.AddEventListener("onNodeVisibilityChanged", onNodeVisibilityChanged)

	_, errors, _ := g.GetPageFormValue("page_service_type")
	fmt.Println("errors: ", errors)

	// input := graph.ValidateNodeInput{
	// 	NodeID: "wu16d202mgqo6bm",
	// 	Value:  "6zjjy5smwoi8es4",
	// }

	// succ, errs := g.ValidateNode(input)
	// if len(errs) == 0 {
	// 	fmt.Println("validation success:", succ)
	// } else {
	// 	fmt.Println("validation errors:", errs)
	// }

	input := graph.ValidateNodeInput{
		NodeID: "hkllsjo4yopmjeh",
		Value:  "phnom_penh",
	}

	succ, errs, children := g.ValidateAddressNode(input)
	if len(errs) == 0 {
		fmt.Println("validation success:", succ, "children: ", children)
	} else {
		fmt.Println("validation errors:", errs)
	}

	input = graph.ValidateNodeInput{
		NodeID: "wu16d202mgqo6bm",
		Value:  "6zjjy5smwoi8es4",
	}

	succ, errs = g.ValidateNode(input)
	if len(errs) == 0 {
		fmt.Println("validation success:", succ)
	} else {
		fmt.Println("validation errors:", errs)
	}
}
