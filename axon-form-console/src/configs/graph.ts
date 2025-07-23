export enum NodeType {
  Input = 'input',
  Option = 'option',
  Value = 'value',
}

export enum NodeFieldType {
  Text = 'text',
  Number = 'number',
  Date = 'date',
  Checkbox = 'checkbox',
  Radio = 'radio',
  Dropdown = 'dropdown',
  Button = 'button',
  Color = 'color',
  DatetimeLocal = 'datetime-local',
  Email = 'email',
  File = 'file',
  Hidden = 'hidden',
  Image = 'image',
  Month = 'month',
  Password = 'password',
  Range = 'range',
  Reset = 'reset',
  Search = 'search',
  Submit = 'submit',
  Tel = 'tel',
  Time = 'time',
  Url = 'url',
  Week = 'week',
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
