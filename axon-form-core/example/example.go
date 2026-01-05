package main

import (
	"axon-form/core/internal/graph"
	"fmt"
	"os"
)

func main() {
	// Read the JSON file
	jsonData, err := os.ReadFile("/Users/panharithsun/Documents/EYKC/axon-form/axon-form-core/example/assets/example-graph-simple.json")
	if err != nil {
		fmt.Printf("Error reading JSON file: %v", err)
	}

	addressData, err := os.ReadFile("/Users/panharithsun/Documents/EYKC/axon-form/axon-form-core/example/assets/sample-address.json")
	if err != nil {
		fmt.Printf("Error reading JSON file: %v", err)
	}

	g := graph.Graph{}

	g.InitGraph(jsonData)
	g.InitAddress(addressData)

	provinceOptions, err := g.GetOptionNodes("kXhgdF5qwqEjdG5B1Alrd")
	fmt.Println("province options: ", provinceOptions, "\n")

	province_option_input := graph.ValidateNodeInput{
		NodeID: "kXhgdF5qwqEjdG5B1Alrd",
		Value:  "kandal",
	}

	_, errs, nodeIds := g.ValidateAddressNode(province_option_input)
	fmt.Println("nodeIds after validating province: ", nodeIds)
	if len(errs) > 0 {
		fmt.Println("province option validation errors:", errs)
	}

	districtOptions, err := g.GetOptionNodes("133vVgWuRSpGlx8a5YQkh")
	fmt.Println("district options: ", districtOptions, "\n")

	district_option_input := graph.ValidateNodeInput{
		NodeID: "133vVgWuRSpGlx8a5YQkh",
		Value:  "angk_snuol",
	}

	_, errs, nodeIds = g.ValidateAddressNode(district_option_input)
	fmt.Println("nodeIds after validating district: ", nodeIds)
	if len(errs) > 0 {
		fmt.Println("district option validation errors:", errs)
	}

	communeOptions, err := g.GetOptionNodes("4sXQ1b71mN2zj32CRJWae")
	fmt.Println("commune options: ", communeOptions, "\n")

	commune_option_input := graph.ValidateNodeInput{
		NodeID: "4sXQ1b71mN2zj32CRJWae",
		Value:  "baek_chan",
	}

	_, errs, nodeIds = g.ValidateAddressNode(commune_option_input)
	fmt.Println("ids to refresh commune: ", nodeIds)
	if len(errs) > 0 {
		fmt.Println("commune option validation errors:", errs)
	}

	villageOptions, _ := g.GetOptionNodes("rbBgG4U3nltmJpNmgadt4")
	fmt.Println("village options: ", villageOptions, "\n")

	village_option_input := graph.ValidateNodeInput{
		NodeID: "rbBgG4U3nltmJpNmgadt4",
		Value:  "prey_tonloab",
	}

	succ, errs, nodeIds := g.ValidateAddressNode(village_option_input)
	fmt.Println("ids to refresh village: ", nodeIds)
	if len(errs) > 0 {
		fmt.Println("village option validation errors:", errs)
	}

	product_type_input := graph.ValidateNodeInput{
		NodeID: "t494fub1vww8jv2",
		Value:  "kq1sfch5ivka5wd",
	}

	customer_name_input := graph.ValidateNodeInput{
		NodeID: "b8mvlvxveal87lw",
		Value:  "Sambath",
	}

	email_input := graph.ValidateNodeInput{
		NodeID: "7fzhb9en55ntbeh",
		Value:  "test@gmail.com",
	}

	delivery_option_input := graph.ValidateNodeInput{
		NodeID: "byfr5rsuiidyvsq",
		Value:  "5nb3tdl76esj1et",
	}

	succ, errs = g.ValidateNode(product_type_input)
	if len(errs) == 0 {
		fmt.Println("product type validation success:", succ)
	} else {
		fmt.Println("product type validation errors:", errs)
	}

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

	result, err := g.GetFormValue()
	if err != nil {
		fmt.Println("get form value error >>", err)
	}

	fmt.Println("form value result >>", result)

	pageResult, _ := g.GetPageFormValue("jlsey36msvujn50")
	fmt.Println("page form value >>", pageResult)
}
