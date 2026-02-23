package util

import (
	"fmt"
	"strconv"
	"strings"
	"time"
)

// ParseDateTime parses a datetime string into a time.Time object.
// The layout parameter should match the format of the input string.
// Example layout: "2006-01-02 15:04:05"
func ParseDateTime(datetimeStr, layout string) (time.Time, error) {
	return time.Parse(layout, datetimeStr)
}

// GetCurrentTime returns the current local time.
func GetCurrentTime() time.Time {
	return time.Now()
}

// ParseCustomDuration parses "15Y", "3M", "10D", or "2W" into calendar units.
func ParseCustomDuration(duration string) (years, months, days int, err error) {
	value := strings.TrimSpace(duration)
	if len(value) < 2 {
		return 0, 0, 0, fmt.Errorf("invalid duration: %s", duration)
	}

	unit := strings.ToUpper(string(value[len(value)-1]))
	number := strings.TrimSpace(value[:len(value)-1])

	amount, err := strconv.Atoi(number)
	if err != nil {
		return 0, 0, 0, fmt.Errorf("invalid duration value: %s", number)
	}

	switch unit {
	case "Y":
		years = amount
	case "M":
		months = amount
	case "D":
		days = amount
	case "W":
		days = amount * 7
	default:
		return 0, 0, 0, fmt.Errorf("unknown duration unit: %s", unit)
	}

	return years, months, days, nil
}

// CompareDateToDurationThreshold compares dateStr with now-duration threshold.
// Returns:
// -1 when dateStr is before threshold (older than duration)
//
//	0 when dateStr equals threshold
//	1 when dateStr is after threshold (less than duration old)
func CompareDateToDurationThreshold(dateStr, duration string) (int, error) {
	date, err := parseFlexibleDateTime(strings.TrimSpace(dateStr))
	if err != nil {
		return 0, fmt.Errorf("invalid date string: %s", dateStr)
	}

	years, months, days, err := ParseCustomDuration(duration)
	if err != nil {
		return 0, err
	}

	threshold := GetCurrentTime().AddDate(-years, -months, -days)
	return date.Compare(threshold), nil
}

func parseFlexibleDateTime(raw string) (time.Time, error) {
	layouts := []string{
		time.RFC3339Nano,
		time.RFC3339,
		"2006-01-02 15:04:05",
		"2006-01-02 15:04",
		"2006-01-02",
	}

	for _, layout := range layouts {
		if t, err := time.Parse(layout, raw); err == nil {
			return t, nil
		}
		if t, err := time.ParseInLocation(layout, raw, time.Local); err == nil {
			return t, nil
		}
	}

	return time.Time{}, fmt.Errorf("invalid datetime: %s", raw)
}
