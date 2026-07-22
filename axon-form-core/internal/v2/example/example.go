package main

import (
	"axon-form/core/internal/v2/formgraph"
	"fmt"
	"os"
)

func main() {
	g := formgraph.NewFormGraph()

	// Read the JSON file
	jsonData, err := os.ReadFile("../../../example/assets/example-no-address.json")
	if err != nil {
		fmt.Printf("Error reading JSON file: %v", err)
	}

	g.InitGraphFromJSON(jsonData)
}
