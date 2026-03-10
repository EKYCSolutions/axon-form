import { PocketBaseCollection } from '@/configs/collections';
import { NodeType } from '@/configs/graph';
import type { NodeBody } from '@/types/Node';
import type { PageBody } from '@/types/Page';
import type {
  ConditionGroupResponse,
  ConditionResponse,
  EdgeResponse,
  FormResponse,
  NodeResponse,
  PageResponse,
} from '@/types/PocketBaseResponse';
import type { ConditionGroupFormSchemaData } from '@/validations/ConditionGroupValidation';
import type { ConditionFormSchemaData } from '@/validations/ConditionValidation';
import type { EdgeFormSchemaData } from '@/validations/EdgeValidation';
import type { FormSchemaData } from '@/validations/FormValidation';
import type { NodeFormSchemaData } from '@/validations/NodeValidation';
import type { PageFormSchemaData } from '@/validations/PageFormValidation';
import PocketBase from 'pocketbase';

export const client = new PocketBase(
  `${import.meta.env.VITE_POCKETBASE_URL}:${
    import.meta.env.VITE_POCKETBASE_PORT
  }`,
);

client.autoCancellation(false);

type SuperuserAuthData = {
  token: string;
  record: Record<string, unknown>;
};

export type SuperuserProfile = {
  id: string;
  email: string | null;
  username: string | null;
  name: string | null;
};

export const loginSuperuser = async (
  identity: string,
  password: string,
): Promise<SuperuserAuthData> => {
  const authData = await client
    .collection('_superusers')
    .authWithPassword(identity, password);

  client.authStore.save(authData.token, authData.record);
  return authData as SuperuserAuthData;
};

export const logoutSuperuser = (): void => {
  client.authStore.clear();
};

export const isSuperuserAuthenticated = (): boolean => {
  return client.authStore.isValid;
};

export const getPocketBaseAuthToken = (): string => {
  return client.authStore.token;
};

export const getCurrentSuperuserProfile = (): SuperuserProfile | null => {
  const record = client.authStore.record as Record<string, unknown> | null;

  if (!record) return null;

  return {
    id: String(record.id ?? ''),
    email: typeof record.email === 'string' ? record.email : null,
    username: typeof record.username === 'string' ? record.username : null,
    name: typeof record.name === 'string' ? record.name : null,
  };
};

export const getAllNodes = async (
  searchString: string = '',
  pageIds: string[] = [],
): Promise<NodeResponse[]> => {
  let filter = `label ~ "${searchString}"`;
  if (pageIds.length > 0) {
    const pageFilter = pageIds.map((id) => `page="${id}"`).join('||');
    filter += ` && (${pageFilter})`;
  }
  return await client.collection(PocketBaseCollection.NODES).getFullList({
    filter,
    expand:
      'edges_via_source_node.conditions_via_edge,edges_via_target_node.conditions_via_edge',
  });
};

export const getAllInputFieldNodes = async (
  pageId?: string,
): Promise<NodeResponse[]> => {
  return await client.collection(PocketBaseCollection.NODES).getFullList({
    filter: `type="${NodeType.Input}"${pageId && `&& page!="${pageId}"`}`,
  });
};

export const createNode = async (data: NodeBody): Promise<NodeResponse> => {
  return await client.collection(PocketBaseCollection.NODES).create(data);
};

export const getNode = async (id: string): Promise<NodeResponse> => {
  return await client.collection(PocketBaseCollection.NODES).getOne(id);
};

export const getPageNode = async (pageId: string): Promise<NodeResponse> => {
  return await client
    .collection(PocketBaseCollection.NODES)
    .getFirstListItem(`type="${NodeType.Page}" && page="${pageId}"`);
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
    check_node: data.check_node_id,
    edge: data.edge,
    expression: data.expr,
    expected_value: data.value,
  });
};

export const getAllConditions = async (): Promise<unknown> => {
  return await client.collection(PocketBaseCollection.CONDITIONS).getFullList();
};

export const getCondition = async (id: string): Promise<unknown> => {
  return await client.collection(PocketBaseCollection.CONDITIONS).getOne(id);
};

export const updateCondition = async (
  id: string,
  data: Partial<ConditionFormSchemaData>,
): Promise<unknown> => {
  return await client.collection(PocketBaseCollection.CONDITIONS).update(id, {
    check_node: data.check_node_id,
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

export const createConditionGroupFromString = async (
  nodeId: string,
  conditions: string,
): Promise<unknown> => {
  return await client.collection(PocketBaseCollection.CONDITION_GROUPS).create({
    node: nodeId,
    conditions,
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

export const clearAllData = async (): Promise<void> => {
  const collections = [
    PocketBaseCollection.CONDITIONS,
    PocketBaseCollection.CONDITION_GROUPS,
    PocketBaseCollection.EDGES,
    PocketBaseCollection.VALIDATIONS,
    PocketBaseCollection.NODES,
    PocketBaseCollection.PAGES,
  ];

  for (const collection of collections) {
    const records = await client.collection(collection).getFullList();
    if (!records.length) continue;
    await Promise.all(
      records.map((record) => client.collection(collection).delete(record.id)),
    );
  }
};

export const getAllForms = async (): Promise<FormResponse[]> => {
  return await client.collection(PocketBaseCollection.FORMS).getFullList({
    sort: '-updated',
  });
};

export const getFormById = async (id: string): Promise<FormResponse> => {
  return await client.collection(PocketBaseCollection.FORMS).getOne(id);
};

export const createForm = async (
  data: FormSchemaData,
): Promise<FormResponse> => {
  return await client.collection(PocketBaseCollection.FORMS).create(data);
};

export const updateForm = async (
  id: string,
  data: Partial<FormSchemaData>,
): Promise<PageResponse> => {
  //
  return await client.collection(PocketBaseCollection.FORMS).update(id, data);
};

export const deleteForm = async (id: string): Promise<boolean> => {
  return await client.collection(PocketBaseCollection.FORMS).delete(id);
};

export const getAllPages = async (formId: string): Promise<PageResponse[]> => {
  return await client.collection(PocketBaseCollection.PAGES).getFullList({
    expand: 'fields',
    filter: `form = "${formId}"`,
  });
};

export const getPageById = async (id: string): Promise<PageResponse> => {
  return await client.collection(PocketBaseCollection.PAGES).getOne(id, {
    expand: 'fields,fields.edges_via_source_node,fields.edges_via_source_node',
  });
};

export const createPage = async (
  data: PageFormSchemaData,
): Promise<PageResponse> => {
  return await client.collection(PocketBaseCollection.PAGES).create(data);
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
