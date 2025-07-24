import { PocketBaseCollection } from '@/configs/collections';
import type { EdgeFormSchemaData } from '@/validations/EdgeValidation.js';
import type { NodeFormSchemaData } from '@/validations/NodeValidation.js';
import PocketBase from 'pocketbase';

const token = import.meta.env.VITE_POCKETBASE_TOKEN || '';

export const client = new PocketBase(
  `${import.meta.env.VITE_POCKETBASE_URL}:${
    import.meta.env.VITE_POCKETBASE_PORT
  }`,
);

client.authStore.save(token, null);

export const getAllNodes = async (): Promise<any> => {
  return await client.collection(PocketBaseCollection.NODES).getList(1, 50, {});
};

export const createNode = async (data: NodeFormSchemaData): Promise<any> => {
  return await client.collection(PocketBaseCollection.NODES).create({
    label: data.label,
    type: data.type,
    field_type: data.field_type,
  });
};

export const getNode = async (id: string): Promise<any> => {
  return await client.collection(PocketBaseCollection.NODES).getOne(id);
};

export const updateNode = async (
  id: string,
  data: Partial<NodeFormSchemaData>,
): Promise<any> => {
  return await client.collection(PocketBaseCollection.NODES).update(id, data);
};

export const deleteNode = async (id: string): Promise<any> => {
  return await client.collection(PocketBaseCollection.NODES).delete(id);
};

export const createEdge = async (data: EdgeFormSchemaData): Promise<any> => {
  return await client.collection(PocketBaseCollection.EDGES).create({
    source_node: data.source_node,
    target_node: data.target_node,
    type: data.edge_type,
  });
};

export const getAllEdges = async (): Promise<any> => {
  return await client.collection(PocketBaseCollection.EDGES).getList(1, 50, {});
};

export const getEdge = async (id: string): Promise<any> => {
  return await client.collection(PocketBaseCollection.EDGES).getOne(id);
};

export const updateEdge = async (
  id: string,
  data: Partial<EdgeFormSchemaData>,
): Promise<any> => {
  return await client.collection(PocketBaseCollection.EDGES).update(id, data);
};

export const deleteEdge = async (id: string): Promise<any> => {
  return await client.collection(PocketBaseCollection.EDGES).delete(id);
};
