package address

type Village struct {
	ID     int    `json:"code"`
	NameKh string `json:"name_kh"`
	NameEn string `json:"name_en"`
}

type Commune struct {
	ID       int                `json:"code"`
	NameKh   string             `json:"name_kh"`
	NameEn   string             `json:"name_en"`
	Villages map[string]Village `json:"village,omitempty"`
}

type District struct {
	ID       int                `json:"code"`
	NameKh   string             `json:"name_kh"`
	NameEn   string             `json:"name_en"`
	Communes map[string]Commune `json:"commune,omitempty"`
}

type Province struct {
	ID        int                 `json:"code"`
	NameKh    string              `json:"name_kh"`
	NameEn    string              `json:"name_en"`
	Districts map[string]District `json:"district,omitempty"`
}

type Address struct {
	Provinces map[string]Province
}

type AddressInfo struct {
	ID     int    `json:"code"`
	Key    string `json:"key"`
	NameKh string `json:"name_kh"`
	NameEn string `json:"name_en"`
}
