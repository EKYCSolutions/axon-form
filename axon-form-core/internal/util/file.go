package util

import (
	"encoding/json"
	"os"
)

// map[string][]any
// for json structure
// {
// 	"key1": [],
// 	"key2": []
// }

func ReadFile(filePath string) map[string][]any {
	file, err := os.Open(filePath)
	if err != nil {
		panic(err)
	}
	defer file.Close()

	var result map[string][]any

	if err := json.NewDecoder(file).Decode(&result); err != nil {
		panic(err)
	}

	return result
}
