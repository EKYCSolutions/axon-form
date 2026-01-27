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
	jsonData, err := os.ReadFile("/Users/panharithsun/Documents/EYKC/axon-form/axon-form-core/example/assets/example.json")
	if err != nil {
		fmt.Printf("Error reading JSON file: %v", err)
	}

	g := graph.Graph{}

	g.InitGraph(jsonData)
	g.AddEventListener("onNodeValidatedChanged", onNodeValidatedChanged)
	g.AddEventListener("onNodeVisibilityChanged", onNodeVisibilityChanged)

	fmt.Println("p3_birth_place: ", g.Nodes["pages"]["p3_birth_place"].IsVisible)
	fmt.Println("f_dob: ", g.Nodes["inputs"]["f_dob"].IsVisible)
	fmt.Println("f_born_dom_province: ", g.Nodes["inputs"]["f_born_dom_province"].IsVisible)
	fmt.Println("f_born_intl_country: ", g.Nodes["inputs"]["f_born_intl_country"].IsVisible)

	// input := graph.ValidateNodeInput{
	// 	NodeID: "f_gender",
	// 	Value:  "opt_m",
	// }

	// succ, errs := g.ValidateNode(input)
	// if len(errs) == 0 {
	// 	fmt.Println("validation success:", succ)
	// } else {
	// 	fmt.Println("validation errors:", errs)
	// }

	// input = graph.ValidateNodeInput{
	// 	NodeID: "f_terms",
	// 	Value:  "true",
	// }

	// succ, errs = g.ValidateNode(input)
	// if len(errs) == 0 {
	// 	fmt.Println("validation success:", succ)
	// } else {
	// 	fmt.Println("validation errors:", errs)
	// }

	// input = graph.ValidateNodeInput{
	// 	NodeID: "f_terms",
	// 	Value:  "false",
	// }

	// succ, errs = g.ValidateNode(input)

	// fmt.Println("p3_birth_place: ", g.Nodes["pages"]["p3_birth_place"].IsVisible)
	// fmt.Println("f_dob: ", g.Nodes["inputs"]["f_dob"].IsVisible)
	// if len(errs) == 0 {
	// 	fmt.Println("validation success:", succ)
	// } else {
	// 	fmt.Println("validation errors:", errs)
	// }

	// input := graph.ValidateNodeInput{
	// 	NodeID: "pob_prov",
	// 	Value:  "kandal",
	// }

	// succ, errs, childrennodes := g.ValidateAddressNode(input)
	// if len(errs) == 0 {
	// 	fmt.Println("validation success:", succ, childrennodes)
	// } else {
	// 	fmt.Println("validation errors:", errs)
	// }

	// _, err, result := g.GetFormValue()
	// fmt.Println("get form value validation errors:", err)
	// fmt.Println("get form value result:", result)

}
