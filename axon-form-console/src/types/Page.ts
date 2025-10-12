import type { Node } from './Node';

export interface Page {
  id: string;
  order: number;
  title: string;
  description: string;
  fields: Node[];
}
