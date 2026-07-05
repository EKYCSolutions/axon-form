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

	var currentAddressProvinceId = "20iqtj96wvp1odr"
	var currentAddressDistrictId = "qt6boux5aeyy43o"
	var currentAddressCommuneId = "4w7p1ygthpnqg5n"
	var currentAddressVillageId = "x56861jour7h9o3"

	// // Read the JSON file
	jsonData, err := os.ReadFile("assets/khmereid-passport-self-request-form.json")
	if err != nil {
		fmt.Printf("Error reading JSON file: %v", err)
	}

	g := graph.Graph{}

	g.InitGraph(jsonData)
	g.AddEventListener("onNodeValidatedChanged", onNodeValidatedChanged)
	g.AddEventListener("onNodeVisibilityChanged", onNodeVisibilityChanged)

	province_input := graph.ValidateNodeInput{
		NodeID: currentAddressProvinceId,
		Value:  "phnom_penh",
	}

	g.ValidateAddressNode(province_input)
	nValue, _ := g.GetNodeValue(currentAddressProvinceId)
	fmt.Println("value received: ", nValue)

	district_input := graph.ValidateNodeInput{
		NodeID: currentAddressDistrictId,
		Value:  "saensokh",
	}

	g.ValidateAddressNode(district_input)
	nValue, _ = g.GetNodeValue(currentAddressDistrictId)
	fmt.Println("value received: ", nValue)

	commune_input := graph.ValidateNodeInput{
		NodeID: currentAddressCommuneId,
		Value:  "ou_baek_k'am",
	}

	g.ValidateAddressNode(commune_input)
	nValue, _ = g.GetNodeValue(currentAddressCommuneId)
	fmt.Println("value received: ", nValue)

	village_input := graph.ValidateNodeInput{
		NodeID: currentAddressVillageId,
		Value:  "orchide",
	}

	g.ValidateAddressNode(village_input)
	nValue, _ = g.GetNodeValue(currentAddressVillageId)
	fmt.Println("value received: ", nValue)

	_, err, res := g.GetFormValue(false)

	fmt.Println("err: ", err, "result: ", res)
}
