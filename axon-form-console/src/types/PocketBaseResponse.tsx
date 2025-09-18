export interface BaseResponse {
  id: string;
  created_at: Date;
  updated_at: Date;
}

export interface NodeResponse extends BaseResponse {
  type: string;
  label: string;
  field_type: string;
  field_name?: string;
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
}

export interface ConditionGroupResponse extends BaseResponse {
  node: string;
  conditions: string;
}

export interface PageResponse extends BaseResponse {
  title: string;
  description: string;
  field_ids: Record<string, string[]>;
}
