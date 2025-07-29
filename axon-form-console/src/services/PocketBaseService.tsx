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
    fieldType: data.field_type,
    is_visible: data.is_visible,
    nodeType: data.type,
    validation_rules: data.validation_rules,
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
    type: data.type,
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

export const createCondition = async (
  data: ConditionFormSchemaData,
): Promise<any> => {
  return await client.collection(PocketBaseCollection.CONDITIONS).create({
    source_node: data.source_node,
    target_node: data.target_node,
    type: data.type,
  });
};

export const getAllConditions = async (): Promise<any> => {
  return await client
    .collection(PocketBaseCollection.CONDITIONS)
    .getList(1, 50, {});
};

export const getCondition = async (id: string): Promise<any> => {
  return await client.collection(PocketBaseCollection.CONDITIONS).getOne(id);
};

export const updateCondition = async (
  id: string,
  data: Partial<ConditionFormSchemaData>,
): Promise<any> => {
  return await client
    .collection(PocketBaseCollection.CONDITIONS)
    .update(id, data);
};

export const deleteCondition = async (id: string): Promise<any> => {
  return await client.collection(PocketBaseCollection.CONDITIONS).delete(id);
};
