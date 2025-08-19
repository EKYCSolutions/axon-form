package util

import (
	"go.uber.org/zap"
)

var logger *zap.Logger

func NewLogger() {
	var err error
	logger, err = zap.NewDevelopment()
	//
	if err != nil {
		panic(err)
	}
	defer logger.Sync()
}

func GetLogger() *zap.Logger {
	if logger == nil {
		panic("Logger is not initialized")
	}

	return logger
}
