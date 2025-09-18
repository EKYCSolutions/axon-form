export enum NodeType {
  Input = 'input',
  Value = 'value',
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
}

export enum EdgeType {
  HasOption = 'has_options',
  HasField = 'has_field',
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
  AddPage = 'add_page',
  EditPage = 'edit_page',
  ShowPage = 'show_page',
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
