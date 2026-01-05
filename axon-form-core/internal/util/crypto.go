package util

import (
	"crypto/rand"
	"math/big"
)

const charset = "abcdefghijklmnopqrstuvwxyz0123456789"

func GenerateID(length int) (*string, error) {
	id := make([]byte, length)
	for i := range id {
		n, err := rand.Int(rand.Reader, big.NewInt(int64(len(charset))))
		if err != nil {
			return nil, err
		}
		id[i] = charset[n.Int64()]
	}
	result := string(id)
	return &result, nil
}
