export interface BaseResponse {
  id: string;
  created: Date;
  updated: Date;
}

export interface NodeResponse extends BaseResponse {
  page: string;
  order: number;
  label: string;
  value: string;
  type: string;
  field_type: string;
  field_name?: string;
  placeholder?: string;
  //
  config: Record<string, unknown>;
  validation_rules: Record<string, string | number>[];
  //
  expand?: {
    edges_via_source_node?: EdgeResponse[];
    edges_via_target_node?: EdgeResponse[];
  };
}
export interface EdgeResponse extends BaseResponse {
  label: string;
  source_node: string;
  target_node: string;
  type: string;
  //
  expand?: {
    conditions_via_edge: ConditionResponse[];
  };
}

export interface ConditionResponse extends BaseResponse {
  check_node: string;
  edge: string;
  expression: string;
  expected_value: string;
  target_node_id: string;
}

export interface ConditionGroupResponse extends BaseResponse {
  node: string;
  conditions: string;
}

export interface PageResponse extends BaseResponse {
  form: string;
  order: number;
  title: string;
  description: string;
  fields: NodeResponse[];
  //
  expand: {
    fields: NodeResponse[];
  };
}

export interface FormResponse extends BaseResponse {
  title: string;
  description: string;
}
