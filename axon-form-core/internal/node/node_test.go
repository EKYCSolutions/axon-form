package node

import (
	"testing"
)

func TestNode_IsRequired(t *testing.T) {
	tests := []struct {
		name string
		node *Node
		want bool
	}{
		{
			name: "Required rule present",
			node: &Node{
				ValidationRules: []ValidationRule{
					{Type: ValidationRuleTypeRequired},
				},
			},
			want: true,
		},
		{
			name: "No required rule",
			node: &Node{
				ValidationRules: []ValidationRule{
					{Type: ValidationRuleTypePattern},
				},
			},
			want: false,
		},
		{
			name: "Empty rules",
			node: &Node{
				ValidationRules: []ValidationRule{},
			},
			want: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := tt.node.IsRequired; got != tt.want {
				t.Errorf("Node.IsRequired() = %v, want %v", got, tt.want)
			}
		})
	}
}
