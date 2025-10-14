import type { Node } from './Node';

export interface Page {
  id: string;
  order: number;
  title: string;
  description: string;
  fields: Node[];
}

export interface PageBody {
  order: number | undefined;
  title: string | undefined;
  description: string | undefined;
  fields: string[];
}
