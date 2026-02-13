import type { Node, NodeCondition } from './Node';

export interface Page {
  id: string;
  form: string;
  order: number;
  title: string;
  description: string;
  fields: Node[];
  //
  node_id?: string;
  conditions?: NodeCondition[];
}

export interface PageBody {
  order: number | undefined;
  title: string | undefined;
  description: string | undefined;
  fields: string[];
}
