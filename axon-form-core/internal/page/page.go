package page

type Page struct {
	ID          string   `json:"id"`
	Title       string   `json:"title"`
	Description string   `json:"description"`
	FieldIDs    []string `json:"field_ids"`
	Order       int      `json:"order"`
}
