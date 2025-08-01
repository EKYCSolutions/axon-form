export enum NodeType {
  Input = 'input',
  Options = 'options',
  Values = 'values',
}

export enum NodeFieldType {
  Text = 'text',
  Number = 'number',
  Datetime = 'datetime',
  MultiSelect = 'multi_select',
  Radio = 'radio',
  Dropdown = 'dropdown',
  Checkbox = 'checkbox',
  File = 'file',
  Password = 'password',
  //
  // Button = 'button',
  // Color = 'color',
  // DatetimeLocal = 'datetime-local',
  // Email = 'email',
  // Hidden = 'hidden',
  // Image = 'image',
  // Month = 'month',
  // Range = 'range',
  // Reset = 'reset',
  // Search = 'search',
  // Submit = 'submit',
  // Tel = 'tel',
  // Time = 'time',
  // Url = 'url',
  // Week = 'week',
}

export enum EdgeType {
  HasOption = 'has_options',
  Validates = 'validates',
  Shows = 'shows',
}

export enum GraphSheetType {
  AddNode = 'add_node',
  EditNode = 'edit_node',
  ShowNode = 'show_node',
  AddEdge = 'add_edge',
  EditEdge = 'edit_edge',
  ShowEdge = 'show_edge',
  AddConditionGroup = 'add_condition_group',
  EditConditionGroup = 'edit_condition_group',
  ShowConditionGroup = 'show_condition_group',
}

export enum ConditionExpression {
  Equal = 'equal',
  MoreThan = 'more_than',
  LessThan = 'less_than',
  MoreThanOrEqual = 'more_than_or_equal',
  LessThanOrEqual = 'less_than_or_equal',
  NotEqual = 'not_equal',
  Contains = 'contains',
  StartsWith = 'starts_with',
  EndsWith = 'ends_with',
}

export enum ConditionGroupExpression {
  And = 'and',
  Or = 'or',
  Nor = 'nor',
  Not = 'not',
}

export enum ValidationRuleType {
  Required = 'required',
  Email = 'email',
  MinLength = 'min_length',
  MaxLength = 'max_length',
  Pattern = 'pattern',
  Min = 'min',
  Max = 'max',
}
