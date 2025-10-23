package page

import (
	"encoding/json"
)

func NewPageFromJSON(pageJson map[string]any) Page {
	var page Page

	pageJsonBytes, err := json.Marshal(pageJson)
	if err != nil {
		panic(err)
	}

	if err := json.Unmarshal(pageJsonBytes, &page); err != nil {
		panic(err)
	}

	return page
}

func GetPageByID(id string, pages map[string]*Page) *Page {
	page, ok := pages[id]
	if !ok {
		return nil
	}
	return page
}
