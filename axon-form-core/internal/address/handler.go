package address

import (
	"encoding/json"
	"errors"
	"slices"
	"strings"
)

func (a *Address) InitAddress(jsonBytes []byte) (bool, error) {
	//
	a.Provinces = make(map[string]Province)
	//
	if err := json.Unmarshal(jsonBytes, &a.Provinces); err != nil {
		return false, err
	}

	return true, nil
}

func (a *Address) GetProvinces() ([]AddressInfo, error) {
	provinces := make([]AddressInfo, 0, len(a.Provinces))
	for key, province := range a.Provinces {
		provinces = append(provinces, AddressInfo{
			ID:     province.ID,
			NameEn: province.NameEn,
			NameKh: province.NameKh,
			Key:    key,
		})
	}
	//
	a.sortList(provinces)
	//
	return provinces, nil
}

func (a *Address) GetDistricts(provinceKey string) ([]AddressInfo, error) {
	province, ok := a.Provinces[provinceKey]
	if !ok {
		return []AddressInfo{}, errors.New("Province key not found")
	}

	districts := make([]AddressInfo, 0, len(province.Districts))

	for key, district := range province.Districts {
		districts = append(districts, AddressInfo{
			ID:     district.ID,
			NameEn: district.NameEn,
			NameKh: district.NameKh,
			Key:    key,
		})
	}
	//
	a.sortList(districts)
	//
	return districts, nil
}

func (a *Address) GetCommunes(provinceKey string, districtKey string) ([]AddressInfo, error) {
	province, ok := a.Provinces[provinceKey]
	if !ok {
		return []AddressInfo{}, errors.New("Province key not found")
	}

	district, ok := province.Districts[districtKey]
	if !ok {
		return []AddressInfo{}, errors.New("District key not found")
	}

	communes := make([]AddressInfo, 0, len(district.Communes))

	for key, commune := range district.Communes {
		communes = append(communes, AddressInfo{
			ID:     commune.ID,
			NameEn: commune.NameEn,
			NameKh: commune.NameKh,
			Key:    key,
		})
	}
	//
	a.sortList(communes)
	//
	return communes, nil
}

func (a *Address) GetVillages(provinceKey string, districtKey string, communeKey string) ([]AddressInfo, error) {
	province, ok := a.Provinces[provinceKey]
	if !ok {
		return []AddressInfo{}, errors.New("Province key not found")
	}

	district, ok := province.Districts[districtKey]
	if !ok {
		return []AddressInfo{}, errors.New("District key not found")
	}

	communes, ok := district.Communes[communeKey]
	if !ok {
		return []AddressInfo{}, errors.New("Commune key not found")
	}

	villages := make([]AddressInfo, 0, len(communes.Villages))

	for key, village := range communes.Villages {
		villages = append(villages, AddressInfo{
			ID:     village.ID,
			NameEn: village.NameEn,
			NameKh: village.NameKh,
			Key:    key,
		})
	}
	//
	a.sortList(villages)
	//
	return villages, nil
}

func (a *Address) sortList(sortList []AddressInfo) {
	slices.SortFunc(sortList, func(a, b AddressInfo) int {
		return strings.Compare(a.NameEn, b.NameEn)
	})
}
