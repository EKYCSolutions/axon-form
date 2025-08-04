export interface BaseResponse {
  id: string;
  created_at: Date;
  updated_at: Date;
}

export interface NodeResponse extends BaseResponse {
  type: string;
  field_type: string;
  label: string;
  //
  config: Record<string, unknown>;
  validation_rules: Record<string, unknown>;
}
export interface EdgeResponse extends BaseResponse {
  label: string;
  source_node: string;
  target_node: string;
  type: string;
  //
  expand: {
    conditions_via_edge: ConditionResponse[];
  };
}

export interface ConditionResponse extends BaseResponse {
  check_node: string;
  edge: string;
  expression: string;
  expected_value: string;
}
