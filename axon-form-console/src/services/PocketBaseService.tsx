import { PocketBaseCollection } from '@/configs/collections';
import type { NodeBody } from '@/types/Node';
import type { PageBody } from '@/types/Page';
import type {
  ConditionGroupResponse,
  ConditionResponse,
  EdgeResponse,
  NodeResponse,
  PageResponse,
} from '@/types/PocketBaseResponse';
import type { ConditionGroupFormSchemaData } from '@/validations/ConditionGroupValidation';
import type { ConditionFormSchemaData } from '@/validations/ConditionValidation';
import type { EdgeFormSchemaData } from '@/validations/EdgeValidation';
import type { NodeFormSchemaData } from '@/validations/NodeValidation';
import type { PageFormSchemaData } from '@/validations/PageFormValidation';
import PocketBase from 'pocketbase';

const token = import.meta.env.VITE_POCKETBASE_TOKEN || '';

export const client = new PocketBase(
  `${import.meta.env.VITE_POCKETBASE_URL}:${
    import.meta.env.VITE_POCKETBASE_PORT
  }`,
);

client.authStore.save(token, null);
client.autoCancellation(false);

export const getAllNodes = async (
  searchString: string = '',
): Promise<NodeResponse[]> => {
  return await client.collection(PocketBaseCollection.NODES).getFullList({
    filter: `label ~ "${searchString}"`,
    expand:
      'edges_via_source_node.conditions_via_edge,edges_via_target_node.conditions_via_edge',
  });
};

export const createNode = async (data: NodeBody): Promise<NodeResponse> => {
  return await client.collection(PocketBaseCollection.NODES).create(data);
};

export const getNode = async (id: string): Promise<NodeResponse> => {
  return await client.collection(PocketBaseCollection.NODES).getOne(id);
};

export const getValueNodes = async (
  sourceNodeId: string,
): Promise<NodeResponse[]> => {
  const edges = await client.collection('edges').getFullList({
    filter: `source_node="${sourceNodeId}" && type="has_options"`,
    expand: 'target_node',
  });

  return edges.map((edge) => edge.expand?.target_node).filter(Boolean);
};

export const updateNode = async (
  id: string,
  data: Partial<NodeFormSchemaData>,
): Promise<NodeResponse> => {
  return await client.collection(PocketBaseCollection.NODES).update(id, data);
};

export const deleteNode = async (id: string): Promise<boolean> => {
  return await client.collection(PocketBaseCollection.NODES).delete(id);
};

export const createEdge = async (
  data: EdgeFormSchemaData,
): Promise<EdgeResponse> => {
  return await client.collection(PocketBaseCollection.EDGES).create({
    label: data.label,
    source_node: data.source_node,
    target_node: data.target_node,
    type: data.type,
  });
};

export const getAllEdges = async (): Promise<EdgeResponse[]> => {
  return await client.collection(PocketBaseCollection.EDGES).getFullList({
    expand: 'conditions_via_edge',
  });
};

export const getAllConditionsFromNode = async (
  page_id: string,
): Promise<ConditionResponse[]> => {
  //
  const edges = await client
    .collection(PocketBaseCollection.EDGES)
    .getFullList({
      filter: `target_node.page = "${page_id}"`,
      expand: 'conditions_via_edge',
    });

  //
  const allConditions = edges.flatMap((edge) => {
    const conditions = edge.expand?.conditions_via_edge || [];
    return conditions.map((condition: ConditionResponse) => ({
      ...condition,
      target_node_id: edge.target_node,
    }));
  });

  return allConditions;
};

export const getEdge = async (id: string): Promise<EdgeResponse> => {
  return await client.collection(PocketBaseCollection.EDGES).getOne(id);
};

export const updateEdge = async (
  id: string,
  data: Partial<EdgeFormSchemaData>,
): Promise<EdgeResponse> => {
  return await client.collection(PocketBaseCollection.EDGES).update(id, data);
};

export const deleteEdge = async (id: string): Promise<boolean> => {
  return await client.collection(PocketBaseCollection.EDGES).delete(id);
};

export const createCondition = async (
  data: ConditionFormSchemaData,
): Promise<unknown> => {
  return await client.collection(PocketBaseCollection.CONDITIONS).create({
    check_node: data.node_id,
    edge: data.edge,
    expression: data.expr,
    expected_value: data.value,
  });
};

export const getAllConditions = async (): Promise<unknown> => {
  return await client
    .collection(PocketBaseCollection.CONDITIONS)
    .getFullList([]);
};

export const getCondition = async (id: string): Promise<unknown> => {
  return await client.collection(PocketBaseCollection.CONDITIONS).getOne(id);
};

export const updateCondition = async (
  id: string,
  data: Partial<ConditionFormSchemaData>,
): Promise<unknown> => {
  return await client.collection(PocketBaseCollection.CONDITIONS).update(id, {
    check_node: data.node,
    edge: data.edge,
    expression: data.expr,
    expected_value: data.value,
  });
};

export const deleteCondition = async (id: string): Promise<unknown> => {
  return await client.collection(PocketBaseCollection.CONDITIONS).delete(id);
};

export const createConditionGroup = async (
  data: ConditionGroupFormSchemaData,
  conditonGroupString: string,
): Promise<unknown> => {
  return await client.collection(PocketBaseCollection.CONDITION_GROUPS).create({
    node: data.node,
    conditions: conditonGroupString,
  });
};

export const getAllConditionGroups = async (): Promise<
  ConditionGroupResponse[]
> => {
  return await client
    .collection(PocketBaseCollection.CONDITION_GROUPS)
    .getFullList();
};

export const getConditionGroup = async (id: string): Promise<unknown> => {
  return await client
    .collection(PocketBaseCollection.CONDITION_GROUPS)
    .getOne(id);
};

export const updateConditionGroup = async (
  id: string,
  data: Partial<ConditionFormSchemaData>,
): Promise<unknown> => {
  return await client
    .collection(PocketBaseCollection.CONDITION_GROUPS)
    .update(id, data);
};

export const deleteConditionGroup = async (id: string): Promise<unknown> => {
  return await client
    .collection(PocketBaseCollection.CONDITION_GROUPS)
    .delete(id);
};

export const getAllPages = async (): Promise<PageResponse[]> => {
  return await client.collection(PocketBaseCollection.PAGES).getFullList({
    expand: 'fields',
  });
};

export const getPageById = async (id: string): Promise<PageResponse> => {
  return await client.collection(PocketBaseCollection.PAGES).getOne(id, {
    expand: 'fields,edges_via_source_node',
  });
};

export const createPage = async (
  data: PageFormSchemaData,
): Promise<PageResponse> => {
  return await client.collection(PocketBaseCollection.PAGES).create({
    title: data.title,
    description: data.description,
  });
};

export const getPage = async (id: string): Promise<NodeResponse> => {
  return await client.collection(PocketBaseCollection.PAGES).getOne(id);
};

export const updatePage = async (
  id: string,
  data: Partial<PageBody>,
): Promise<PageResponse> => {
  //
  return await client.collection(PocketBaseCollection.PAGES).update(id, data);
};

export const deletePage = async (id: string): Promise<boolean> => {
  return await client.collection(PocketBaseCollection.PAGES).delete(id);
};

export const updatePageOrder = async (
  id: string,
  data: Partial<NodeFormSchemaData>,
): Promise<NodeResponse> => {
  return await client.collection(PocketBaseCollection.PAGES).update(id, data);
};
