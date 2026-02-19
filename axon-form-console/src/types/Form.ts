import type { BaseModel } from './BaseModel';

export interface Form extends BaseModel {
  id: string;
  title: string;
  description: string;
}
