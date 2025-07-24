export enum NodeType {
  Input = 'input',
  Options = 'options',
  Values = 'values',
}

export enum NodeFieldType {
  Text = 'text',
  Number = 'number',
  Datetime = 'datetime',
  MultiSelect = 'multi-select',
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
}
