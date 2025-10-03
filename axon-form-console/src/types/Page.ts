import type { Node } from './Node';

export interface Page {
  id: string;
  title: string;
  description: string;
  fields: Node[];
}
