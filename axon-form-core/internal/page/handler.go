package page

import (
	"encoding/json"
)

func NewPageFromJSON(pageJson map[string]any) (*Page, error) {
	var page Page

	pageJsonBytes, err := json.Marshal(pageJson)
	if err != nil {
		return nil, err
	}

	if err := json.Unmarshal(pageJsonBytes, &page); err != nil {
		return nil, err
	}

	return &page, nil
}

func GetPageByID(id string, pages map[string]*Page) *Page {
	page, ok := pages[id]
	if !ok {
		return nil
	}
	return page
}
