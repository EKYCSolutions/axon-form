import {
  ConditionExpression,
  EdgeType,
  NodeFieldType,
  NodeFieldTypeWithOptions,
  NodeType,
} from '@/configs/graph';
import {
  FormBuilderContext,
  type FormBuilderContextType,
} from '@/contexts/FormBuilderContext';
import {
  createCondition,
  createConditionGroupFromString as createConditionGroupFromStringService,
  createEdge as createEdgeService,
  createForm as createFormService,
  createNode as createNodeService,
  createPage as createPageService,
  deleteCondition as deleteConditionService,
  deleteForm as deleteFormService,
  deleteNode as deleteNodeService,
  deletePage as deletePageService,
  getAllConditionGroups as getAllConditionGroupsService,
  getAllConditionsFromNode as getAllConditionsFromNodeService,
  getAllForms as getAllFormsService,
  getAllInputFieldNodes as getAllInputFieldNodesService,
  getAllNodes as getAllNodesService,
  getAllPages as getAllPagesService,
  getFormById as getFormByIdService,
  getPageById as getPageByIdService,
  getPageNode as getPageNodeService,
  getValueNodes as getValueNodesService,
  updateCondition as updateConditionService,
  updateEdge as updateEdgeService,
  updateForm as updateFormService,
  updateNode as updateNodeService,
  updatePageOrder as updatePageOrderService,
  updatePage as updatePageService,
} from '@/services/PocketBaseService';
import type { Edge } from '@/types/Edge';
import type { Form } from '@/types/Form';
import type { EdgeConditionGroup } from '@/types/Graph';
import { parseNodeResponse, type Node, type NodeBody } from '@/types/Node';
import type { Page, PageBody } from '@/types/Page';
import type { EdgeResponse, NodeResponse } from '@/types/PocketBaseResponse';
import { exportJSON } from '@/utils/File';
import { getFieldArrayChanges } from '@/utils/Form';
import { convertGraphToJSON } from '@/utils/Graph';
import { handleError, handleSuccess } from '@/utils/Toast';
import type { ConditionFormSchemaData } from '@/validations/ConditionValidation';
import type { EdgeFormSchemaData } from '@/validations/EdgeValidation';
import type { FormSchemaData } from '@/validations/FormValidation';
import { type NodeFormSchemaData } from '@/validations/NodeValidation';
import type { PageConditionFormSchemaData } from '@/validations/PageConditionValidation';
import type { PageFormSchemaData } from '@/validations/PageFormValidation';
import type { SelectOptionFormSchemaData } from '@/validations/SelectOptionValidation';
import type { ValidationRuleSchemaData } from '@/validations/ValidationRulesValidation';
import { useQueries, useQuery } from '@tanstack/react-query';
import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { validate } from 'uuid';

interface FormBuilderProviderProps {
  children: ReactNode;
}

interface FormImportLayoutPage {
  id: string;
  order: number;
  title: string;
  description: string;
  field_ids: string[];
}

interface FormImportNode {
  id: string;
  page: string;
  order?: number;
  type?: string;
  label?: string;
  value?: string;
  placeholder?: string;
  field_type?: string;
  field_name?: string;
  validation_rules?: unknown[];
  config?: Record<string, unknown>;
}

interface FormImportEdge {
  id: string;
  label?: string;
  source_node: string;
  target_node: string;
  type: string;
  conditions?: Array<{
    id: string;
    check_node: string;
    edge: string;
    expr: string;
    value: string;
  }>;
}

interface FormImportConditionGroup {
  id: string;
  node: string;
  conditions: string;
}

interface FormImportPayload {
  form?: {
    id?: string;
    title?: string;
    description?: string;
  };
  layout?: {
    pages?: FormImportLayoutPage[];
  };
  nodes?: FormImportNode[];
  edges?: FormImportEdge[];
  condition_groups?: FormImportConditionGroup[];
}

export function FormBuilderProvider({ children }: FormBuilderProviderProps) {
  const [selectedPageId, setSelectedPageId] = useState<string>();
  const [selectedFormId, setSelectedFormId] = useState<string>();
  const [fetchInputFieldNodes, setFetchInputFieldNodes] =
    useState<boolean>(false);

  // Query: Fetch all pages
  const { data: formsData, refetch: refreshForms } = useQuery({
    queryKey: ['forms'],
    queryFn: () => getAllFormsService(),
  });

  // Query: Fetch single page details
  const { data: singleFormData, refetch: refreshSingleForm } = useQuery({
    queryKey: ['form', selectedFormId],
    queryFn: () => getFormByIdService(selectedFormId!),
    enabled: !!selectedFormId,
  });

  // Query: Fetch all pages
  const { data: pagesData, refetch: refreshPages } = useQuery({
    queryKey: ['pages', selectedFormId],
    queryFn: () => getAllPagesService(selectedFormId!),
    enabled: !!selectedFormId,
  });

  // Query: Fetch single page details
  const { data: singlePageData, refetch: refreshSinglePage } = useQuery({
    queryKey: ['page', selectedPageId],
    queryFn: () => getPageByIdService(selectedPageId!),
    enabled: !!selectedPageId,
  });

  // Query: Fetch field conditions
  const { data: fieldConditionsData, refetch: refreshFieldConditions } =
    useQuery({
      queryKey: ['fieldConditions', selectedPageId],
      queryFn: () => getAllConditionsFromNodeService(selectedPageId!),
      enabled: !!selectedPageId,
    });

  // Query: Fetch page node by page id
  const { data: pageNodeData } = useQuery({
    queryKey: ['pageNode', selectedPageId],
    queryFn: () => getPageNodeService(selectedPageId!),
    enabled: !!selectedPageId,
  });

  // Query: Fetch all input nodes of other pages
  const { data: inputFieldNodesData } = useQuery({
    queryKey: ['inputFieldNodes', selectedPageId],
    queryFn: () => getAllInputFieldNodesService(selectedPageId!),
    enabled: !!selectedPageId && fetchInputFieldNodes,
  });

  // Query: Fetch all condition groups (lazy)
  const { refetch: fetchConditionGroups } = useQuery({
    queryKey: ['conditionGroups'],
    queryFn: getAllConditionGroupsService,
    enabled: false,
  });

  // Query: Fetch nodes by pageIds (lazy)
  const fetchFormById = useCallback(async (id: string): Promise<Form> => {
    const res = await getFormByIdService(id);
    return {
      id: res.id,
      title: res.title,
      description: res.description,
      created_at: res.created,
      updated_at: res.updated,
    };
  }, []);

  // Query: Fetch nodes by pageIds (lazy)
  const fetchNodesByPageIds = useCallback(async (pageIds: string[]) => {
    return await getAllNodesService('', pageIds);
  }, []);

  // Query: Fetch nodes by pageIds (lazy)
  const fetchFormPages = useCallback(
    async (formId: string): Promise<Page[]> => {
      const res = await getAllPagesService(formId);

      return res.map((page) => ({
        id: page.id,
        form: page.form,
        order: page.order,
        title: page.title,
        description: page.description,
        fields:
          page.expand?.fields && page.expand.fields.length > 0
            ? page.expand.fields.map(parseNodeResponse)
            : [],
      }));
    },
    [],
  );

  // Transform pages data
  const forms = useMemo(() => {
    if (!formsData) return [];

    return formsData.map((form) => ({
      ...form,
      updated_at: form.updated,
      created_at: form.created,
    }));
  }, [formsData]);

  const selectedForm: Form | undefined = useMemo(() => {
    if (!singleFormData) return undefined;

    return {
      ...singleFormData,
      updated_at: singleFormData.updated,
      created_at: singleFormData.created,
    };
  }, [singleFormData]);

  // Transform pages data
  const pages = useMemo(() => {
    if (!pagesData) return [];

    return pagesData
      .map((page) => ({
        id: page.id,
        form: page.form,
        order: page.order,
        title: page.title,
        description: page.description,
        fields:
          page.expand?.fields && page.expand.fields.length > 0
            ? page.expand.fields.map(parseNodeResponse)
            : [],
      }))
      .sort((a, b) => a.order - b.order);
  }, [pagesData]);

  // Transform selected page data
  const selectedPageData: Page | undefined = useMemo(() => {
    if (!singlePageData || !pageNodeData) return undefined;

    return {
      id: singlePageData.id,
      form: singlePageData.form,
      node_id: pageNodeData.id,
      order: singlePageData.order,
      title: singlePageData.title,
      description: singlePageData.description,
      fields: singlePageData.expand?.fields?.map(parseNodeResponse),
    };
  }, [singlePageData, pageNodeData]);

  // Get field IDs that need options fetched
  const fieldIdsWithOptions = useMemo(() => {
    if (!selectedPageData) return [];

    return selectedPageData.fields
      ?.filter((field) =>
        NodeFieldTypeWithOptions.includes(field.field_type as NodeFieldType),
      )
      .map((field) => field.id);
  }, [selectedPageData]);

  // Fetch options for all matching fields
  const optionsQueries = useQueries({
    queries: (fieldIdsWithOptions ?? []).map((fieldId) => ({
      queryKey: ['fieldOptions', fieldId],
      queryFn: () => getValueNodesService(fieldId!),
      enabled: !!fieldId,
    })),
  });

  const isAllOptionsLoading = optionsQueries.some((query) => query.isLoading);

  // Combine selected page with options and conditions
  const selectedPage: Page | undefined = useMemo(() => {
    if (!selectedPageData || isAllOptionsLoading) return undefined;

    return {
      ...selectedPageData,
      conditions: fieldConditionsData?.map((cond) => ({
        id: cond.id,
        check_node: cond.check_node,
        edge: cond.edge,
        value: cond.expected_value,
        expr: cond.expression,
        target_node_id: cond.target_node_id,
      })),
      fields: (selectedPageData.fields ?? []).map((field) => {
        // Update conditions
        const conditions = fieldConditionsData
          ?.filter((cond) => cond.target_node_id === field.id)
          .map((cond) => ({
            id: cond.id,
            edge: cond.edge,
            check_node: cond.check_node,
            value: cond.expected_value,
            expr: cond.expression,
            target_node_id: cond.target_node_id,
          }));

        // Find field with options
        const fieldIndex = (fieldIdsWithOptions ?? []).indexOf(field.id);
        const optionsData =
          fieldIndex !== -1
            ? optionsQueries[fieldIndex]?.data?.map((option) => ({
                id: option.id,
                label: option.label,
                value: option.value,
              }))
            : undefined;

        return {
          ...field,
          conditions,
          options: optionsData,
        };
      }),
    };
  }, [
    selectedPageData,
    fieldConditionsData,
    isAllOptionsLoading,
    fieldIdsWithOptions,
    optionsQueries,
  ]);

  const inputFieldNodes: Node[] | undefined = useMemo(() => {
    if (!inputFieldNodesData) return undefined;

    return inputFieldNodesData.map((node: NodeResponse) => ({
      id: node.id,
      type: node.type,
      label: node.label,
      value: node.value,
      field_type: node.field_type,
      field_name: node.field_name ?? '',
      config: node.config ?? {},
    }));
  }, [inputFieldNodesData]);

  // Helper: Create edge
  const addEdge = useCallback(
    async (data: EdgeFormSchemaData): Promise<EdgeResponse | undefined> => {
      try {
        return await createEdgeService(data);
      } catch (error) {
        handleError(error);
        return undefined;
      }
    },
    [],
  );

  const createFilterByEdges = useCallback(
    async (
      fields: NodeFormSchemaData[],
      resolveNodeId: (field: NodeFormSchemaData) => string | undefined,
    ) => {
      await Promise.all(
        fields.map((field) => {
          const childNodeId = resolveNodeId(field);
          const parentNodeId = (
            field.config as Record<string, unknown> | undefined
          )?.parent_field_id as string | undefined;
          if (!parentNodeId) return Promise.resolve();
          if (!childNodeId || !parentNodeId) return Promise.resolve();

          return createEdgeService({
            label: '',
            source_node: childNodeId,
            target_node: parentNodeId,
            type: EdgeType.FilterBy,
          });
        }),
      );
    },
    [],
  );

  // Helper: Add value node with edge
  const addValueNode = useCallback(
    async (
      pageId: string,
      parentNodeId: string,
      option: SelectOptionFormSchemaData,
    ) => {
      try {
        const valueNodeData: NodeBody = {
          id: undefined,
          page: pageId,
          order: undefined,
          type: NodeType.Value,
          label: option.label,
          value: option.value,
          placeholder: undefined,
          field_name: undefined,
          field_type: undefined,
          validation_rules: [],
          config: undefined,
        };

        const addValueNodeRes = await createNodeService(valueNodeData);

        const hasOptionEdgeData: EdgeFormSchemaData = {
          label: `select-${option.value}`,
          source_node: parentNodeId,
          target_node: addValueNodeRes.id,
          type: EdgeType.HasOption,
        };

        await addEdge(hasOptionEdgeData);
      } catch (error) {
        handleError(error);
      }
    },
    [addEdge],
  );

  // Helper: Add condition
  const addCondition = useCallback(
    async (
      targetNode: NodeFormSchemaData,
      condition: ConditionFormSchemaData,
    ) => {
      try {
        const showEdgeData: EdgeFormSchemaData = {
          label: `show-${targetNode.field_name}`,
          source_node: condition.check_node_id!,
          target_node: targetNode.id!,
          type: EdgeType.Shows,
        };

        const edgeRes = await addEdge(showEdgeData);

        await createCondition({
          ...condition,
          edge: edgeRes?.id,
        });
      } catch (error) {
        handleError(error);
      }
    },
    [addEdge],
  );

  // Helper: Add node
  const addNode = useCallback(
    async (
      data: NodeFormSchemaData,
      pageId: string,
    ): Promise<NodeResponse | undefined> => {
      try {
        const addNodeBody: NodeBody = {
          id: undefined,
          page: pageId,
          order: data.order,
          field_name: data.field_name,
          field_type: data.field_type,
          label: data.label,
          value: data.default_value,
          placeholder: data.placeholder,
          type: data.type,
          validation_rules: data.validation_rules ?? [],
          config: data.config,
        };

        const addNodeRes = await createNodeService(addNodeBody);

        // Add value nodes if select options exist
        if (data.select_options?.length) {
          await Promise.all(
            data.select_options.map((option) =>
              addValueNode(pageId, addNodeRes.id, option),
            ),
          );
        }

        return addNodeRes;
      } catch (error) {
        handleError(error);
        return undefined;
      }
    },
    [addValueNode],
  );

  // Helper: Update node
  const updateNode = useCallback(
    async (
      pageId: string,
      id: string,
      initialData: NodeFormSchemaData,
      data: Partial<NodeFormSchemaData>,
    ) => {
      try {
        if (initialData.conditions && data.conditions) {
          // Check conditions state
          const {
            added: addedConditions,
            deleted: deletedConditions,
            updated: updatedConditions,
          } = getFieldArrayChanges(initialData.conditions, data.conditions);

          const nodeConditionData = {
            ...initialData,
            field_name: data.field_name,
          };

          if (data && addedConditions.length > 0) {
            await Promise.all(
              addedConditions.map((cond) =>
                addCondition(nodeConditionData, cond),
              ),
            );
          }

          if (deletedConditions.length > 0) {
            await Promise.all(
              deletedConditions.map((cond) => deleteCondition(cond.id)),
            );
          }

          if (updatedConditions.length > 0) {
            await Promise.all(
              updatedConditions.map((cond) => updateCondition(cond.id, cond)),
            );
          }
        }

        if (initialData.select_options && data.select_options) {
          // Check conditions state
          const {
            added: addedSelectOptions,
            deleted: deletedSelectOptions,
            updated: updatedSelectOptions,
          } = getFieldArrayChanges(
            initialData.select_options,
            data.select_options,
          );

          if (addedSelectOptions.length > 0) {
            await Promise.all(
              addedSelectOptions.map((node) => addValueNode(pageId, id, node)),
            );
          }

          if (deletedSelectOptions.length > 0) {
            await Promise.all(
              deletedSelectOptions.map((node) => deleteNode(node.id)),
            );
          }

          if (updatedSelectOptions.length > 0) {
            await Promise.all(
              updatedSelectOptions.map((node) =>
                updateNodeService(node.id, node),
              ),
            );
          }
        }

        await updateNodeService(id, data);
      } catch (err) {
        handleError(err);
      }
    },
    [],
  );

  const deleteNode = useCallback(async (id: string) => {
    try {
      await deleteNodeService(id);
    } catch (err) {
      handleError(err);
    }
  }, []);

  // Helper: Create node ID mapping
  const createNodeIdMap = (
    fields: NodeFormSchemaData[],
    nodeIds: string[],
  ): Record<string, string> => {
    return fields.reduce(
      (acc, field, idx) => {
        acc[field.id as string] = nodeIds[idx];
        return acc;
      },
      {} as Record<string, string>,
    );
  };

  // Helper: Process field conditions
  const processFieldConditions = useCallback(
    async (fields: NodeFormSchemaData[], nodeIdMap: Record<string, string>) => {
      for (const field of fields) {
        if (!field.conditions) continue;

        await Promise.all(
          field.conditions.map((cond) => {
            const conditionData = {
              ...cond,
              node_id: nodeIdMap[cond.check_node_id as string],
            };
            return addCondition(field, conditionData);
          }),
        );
      }
    },
    [addCondition],
  );

  // API: Get form
  const getForm = useCallback(async (id: string) => {
    setSelectedFormId(id);
  }, []);

  // API: Add form
  const addForm = useCallback(async (data: FormSchemaData) => {
    try {
      await createFormService(data);
      await refreshForms();
      handleSuccess('Add Form Success');
    } catch (err) {
      handleError(err);
    }
  }, []);

  // API: Add form
  const updateForm = useCallback(
    async (id: string, data: Partial<FormSchemaData>) => {
      try {
        await updateFormService(id, data);
        await refreshForms();
        await refreshSingleForm();
        handleSuccess('Update Form Success');
      } catch (err) {
        handleError(err);
      }
    },
    [],
  );

  const deleteForm = useCallback(async (id: string) => {
    try {
      await deleteFormService(id);
      await refreshForms();
      handleSuccess('Delete Form Success');
    } catch (err) {
      handleError(err);
    }
  }, []);

  // API: Add page
  const addPage = useCallback(
    async (data: PageFormSchemaData) => {
      try {
        const nextOrder =
          pages.length > 0
            ? Math.max(...pages.map((page) => page.order)) + 1
            : 0;
        const pageRes = await createPageService(data);
        await createNodeService({
          id: pageRes.id,
          type: NodeType.Page,
          order: undefined,
          page: pageRes.id,
          field_name: undefined,
          field_type: undefined,
          label: undefined,
          value: undefined,
          placeholder: undefined,
          validation_rules: [],
          config: undefined,
        });

        const nodeIds = await Promise.all(
          data.fields.map(async (field) => {
            const res = await addNode(field, pageRes.id);
            return res!.id;
          }),
        );

        const nodeIdMap = createNodeIdMap(data.fields, nodeIds);
        await processFieldConditions(data.fields, nodeIdMap);
        await createFilterByEdges(
          data.fields,
          (field) => nodeIdMap[field.id as string],
        );

        const updatePageBody: PageBody = {
          order: nextOrder,
          title: data.title,
          description: data.description,
          fields: nodeIds,
        };

        await updatePageService(pageRes.id, updatePageBody);
        await refreshPages();
        handleSuccess('Add Page Success');
      } catch (error) {
        handleError(error);
      }
    },
    [addNode, pages, processFieldConditions, refreshPages],
  );

  // API: Get page by ID
  const getPage = useCallback(
    (id: string, fetchInputFieldNodes: boolean = false) => {
      setSelectedPageId(id);
      setFetchInputFieldNodes(fetchInputFieldNodes);
    },
    [],
  );

  // API: Update page
  const updatePage = useCallback(
    async (
      id: string,
      initialData: PageFormSchemaData,
      data: Partial<PageFormSchemaData>,
    ) => {
      try {
        if (!data.fields) return;

        const fieldIds: string[] = [];

        // Update existing fields
        const existingFields = data.fields.filter(
          (field) => !validate(field.id!),
        );

        if (existingFields.length > 0) {
          await Promise.all(
            existingFields.map((field) => {
              const initialFieldData = initialData.fields.find(
                (f) => f.id == field.id,
              );

              if (!initialFieldData) return;

              updateNode(id, field.id!, initialFieldData, field);
            }),
          );
          fieldIds.push(...existingFields.map((field) => field.id!));
        }

        // Create new fields
        const newFields = data.fields.filter((field) => validate(field.id!));
        let newFieldIdMap: Record<string, string> = {};

        if (newFields.length > 0) {
          const newFieldIdsRes = await Promise.all(
            newFields.map(async (field) => {
              const res = await addNode(field, id);
              return res!.id;
            }),
          );

          newFieldIdMap = createNodeIdMap(newFields, newFieldIdsRes);
          await processFieldConditions(newFields, newFieldIdMap);

          fieldIds.push(...newFieldIdsRes);
        }

        await createFilterByEdges(data.fields, (field) => {
          if (validate(field.id!)) {
            return newFieldIdMap[field.id as string];
          }
          return field.id;
        });

        const updatePageBody: PageBody = {
          order: undefined,
          title: data.title,
          description: data.description,
          fields: fieldIds,
        };

        await updatePageService(id, updatePageBody);
        await refreshPages();
        await refreshSinglePage();
        await refreshFieldConditions();
        handleSuccess('Update Page Success');
      } catch (err) {
        handleError(err);
      }
    },
    [
      addNode,
      updateNode,
      processFieldConditions,
      createFilterByEdges,
      refreshPages,
      refreshSinglePage,
      refreshFieldConditions,
    ],
  );

  // API: Delete page
  const deletePage = useCallback(
    async (id: string) => {
      try {
        await deletePageService(id);
        handleSuccess('Delete Page Success');
        await refreshPages();
      } catch (err) {
        handleError(err);
      }
    },
    [refreshPages],
  );

  // API: Add page condition
  const addPageConditions = useCallback(
    async (pageNodeId: string, data: PageConditionFormSchemaData) => {
      try {
        await Promise.all(
          data.conditions.map((cond) => {
            const conditionData = {
              ...cond,
              node_id: cond.check_node_id,
            };

            const nodeConditionData: NodeFormSchemaData = {
              id: pageNodeId,
              type: NodeType.Page,
              label: '',
              field_name: '',
            };

            return addCondition(nodeConditionData, conditionData);
          }),
        );
        await refreshFieldConditions();
        handleSuccess('Add Page Conditions Success');
      } catch (err) {
        handleError(err);
      }
    },
    [refreshFieldConditions],
  );

  // API: Update condition
  const updateCondition = useCallback(
    async (conditionId: string, data: Partial<ConditionFormSchemaData>) => {
      try {
        if (!data.edge) {
          handleError('Update condition data missing field: edge');
          return;
        }

        await updateEdgeService(data.edge, {
          source_node: data.check_node_id,
        });

        await updateConditionService(conditionId, data);
        await refreshFieldConditions();
        handleSuccess('Update Page Conditions Success');
      } catch (err) {
        handleError(err);
      }
    },
    [refreshFieldConditions],
  );

  // API: Delete condition
  const deleteCondition = useCallback(
    async (conditionId: string) => {
      try {
        await deleteConditionService(conditionId);
        await refreshFieldConditions();
        handleSuccess('Delete Page Conditions Success');
      } catch (err) {
        handleError(err);
      }
    },
    [refreshFieldConditions],
  );

  // API: Update page order
  const updatePageOrder = useCallback(
    async (pages: Page[]) => {
      try {
        await Promise.all(
          pages.map((page) =>
            updatePageOrderService(page.id, { order: page.order }),
          ),
        );
        await refreshPages();
      } catch (err) {
        handleError(err);
      }
    },
    [pages],
  );

  // Helper: Parse edges from nodesf
  const parseEdges = useCallback((nodes: Node[]): Edge[] => {
    const nodeIds = new Set(nodes.map((node) => node.id));
    const edgeMap = new Map<string, Edge>();

    nodes.forEach((node) => {
      node.edges?.forEach((edge) => {
        if (
          !edgeMap.has(edge.id) &&
          nodeIds.has(edge.sourceNode) &&
          nodeIds.has(edge.targetNode)
        ) {
          edgeMap.set(edge.id, edge);
        }
      });
    });

    return Array.from(edgeMap.values());
  }, []);

  const replaceEdgeIdsInConditionString = useCallback(
    (conditionString: string, edgeIdMap: Map<string, string>) => {
      let updated = conditionString;
      edgeIdMap.forEach((newId, oldId) => {
        const regex = new RegExp(`\\b${oldId}\\b`, 'g');
        updated = updated.replace(regex, newId);
      });
      return updated;
    },
    [],
  );

  // API: Export form
  const exportForm = useCallback(
    async (id: string, fileName: string) => {
      try {
        let nodesData: NodeResponse[];

        const form = await fetchFormById(id);
        const formPages = await fetchFormPages(id);
        const pageIds = formPages.map((p) => p.id);

        if (pageIds.length == 0) {
          nodesData = [];
        } else {
          nodesData = await fetchNodesByPageIds(pageIds);
        }

        const { data: conditionGroupsData } = await fetchConditionGroups();

        if (!nodesData) return;

        const nodes = nodesData.map(parseNodeResponse);

        const edges = parseEdges(nodes);
        const conditionGroups: EdgeConditionGroup[] = (
          conditionGroupsData ?? []
        ).map((cd) => ({
          id: cd.id,
          node: cd.node,
          conditions: cd.conditions,
        }));

        const json = convertGraphToJSON(
          form,
          nodes,
          edges,
          conditionGroups,
          formPages,
        );

        const addressResponse = await fetch(
          `${import.meta.env.BASE_URL}address.json`,
        );
        const addressData = await addressResponse.json();

        json['address'] = addressData;

        exportJSON(json, fileName);
      } catch (err) {
        handleError(err);
      }
    },
    [
      fetchFormById,
      fetchFormPages,
      fetchConditionGroups,
      parseEdges,
      fetchNodesByPageIds,
    ],
  );

  // API:  from JSON
  const importForm = useCallback(
    async (rawData: unknown): Promise<string | undefined> => {
      try {
        const data = rawData as FormImportPayload;

        if (
          !data?.layout?.pages ||
          !Array.isArray(data.layout.pages) ||
          !data.nodes ||
          !Array.isArray(data.nodes) ||
          !data.edges ||
          !Array.isArray(data.edges)
        ) {
          handleError('Invalid form JSON structure');
          return;
        }

        const importedTitle = data.form?.title?.trim() || 'Imported Form';
        const importedDescription = data.form?.description?.trim();
        const createdForm = await createFormService({
          title: importedTitle,
          description: importedDescription,
        });

        const layoutPages = data.layout.pages;
        const nodes = data.nodes;
        const edges = data.edges;
        const conditionGroups = data.condition_groups ?? [];

        const oldPageIdToNew = new Map<string, string>();
        const oldNodeIdToNew = new Map<string, string>();
        const oldEdgeIdToNew = new Map<string, string>();
        const nodesById = new Map(nodes.map((node) => [node.id, node]));

        // Create pages
        for (const page of layoutPages) {
          const pageRes = await createPageService({
            id: page.id,
            form: createdForm.id,
            title: page.title,
            description: page.description,
            order: page.order,
            fields: [],
          });
          oldPageIdToNew.set(page.id, pageRes.id);
        }

        // Create page nodes
        for (const page of layoutPages) {
          const pageNode = nodesById.get(page.id);
          const pageLabel = pageNode?.label ?? page.title;
          const newPageId = oldPageIdToNew.get(page.id);

          if (!newPageId) {
            throw new Error(`Missing page mapping for ${page.id}`);
          }

          const pageNodeRes = await createNodeService({
            id: page.id,
            page: newPageId,
            order: undefined,
            type: NodeType.Page,
            label: pageLabel,
            value: undefined,
            placeholder: undefined,
            field_name: undefined,
            field_type: undefined,
            validation_rules: [],
            config: undefined,
          });

          oldNodeIdToNew.set(page.id, pageNodeRes.id);
        }

        // Map nodes to pages
        const nodePageMap = new Map<string, string>();
        for (const page of layoutPages) {
          for (const fieldId of page.field_ids ?? []) {
            nodePageMap.set(fieldId, page.id);
          }
          nodePageMap.set(page.id, page.id);
        }

        // Create non-page nodes
        const nonPageNodes = nodes.filter(
          (node) => node.type !== NodeType.Page,
        );

        for (const node of nonPageNodes) {
          const oldPageId = nodePageMap.get(node.page);
          const newPageId = oldPageIdToNew.get(oldPageId!);

          if (!newPageId) continue;

          const nodeRes = await createNodeService({
            id: node.id,
            page: newPageId,
            order: node.order,
            type: node.type as NodeType,
            label: node.label,
            value: node.value,
            placeholder: node.placeholder,
            //
            field_name: node.field_name,
            field_type:
              node.field_type && node.field_type.length > 0
                ? (node.field_type as NodeFieldType)
                : undefined,
            validation_rules: (node.validation_rules ??
              []) as ValidationRuleSchemaData[],
            config: node.config,
          });

          oldNodeIdToNew.set(node.id, nodeRes.id);
        }

        // Create edges and conditions
        for (const edge of edges) {
          const sourceNodeId = oldNodeIdToNew.get(edge.source_node);
          const targetNodeId = oldNodeIdToNew.get(edge.target_node);

          if (!sourceNodeId || !targetNodeId) {
            throw new Error(`Missing node mapping for edge ${edge.id}`);
          }

          const edgeRes = await createEdgeService({
            label: edge.label ?? '',
            source_node: sourceNodeId,
            target_node: targetNodeId,
            type: edge.type as EdgeType,
          });

          oldEdgeIdToNew.set(edge.id, edgeRes.id);

          if (edge.conditions?.length) {
            await Promise.all(
              edge.conditions.map((condition) => {
                const checkNodeId = oldNodeIdToNew.get(condition.check_node);
                if (!checkNodeId) {
                  throw new Error(
                    `Missing check node mapping for condition ${condition.id}`,
                  );
                }

                const isPocketBaseId = /^[a-z0-9]{15}$/.test(condition.value);
                const valueNodeId = oldNodeIdToNew.get(condition.value);

                if (isPocketBaseId && !valueNodeId) {
                  throw new Error(
                    `Missing value node mapping for condition ${condition.id}`,
                  );
                }

                return createCondition({
                  check_node_id: checkNodeId,
                  edge: edgeRes.id,
                  expr: condition.expr as ConditionExpression,
                  value: valueNodeId ?? condition.value,
                });
              }),
            );
          }
        }

        // Create condition groups
        for (const group of conditionGroups) {
          const nodeId = oldNodeIdToNew.get(group.node);
          if (!nodeId) {
            throw new Error(
              `Missing node mapping for condition group ${group.id}`,
            );
          }

          const updatedConditions = replaceEdgeIdsInConditionString(
            group.conditions,
            oldEdgeIdToNew,
          );

          await createConditionGroupFromStringService(
            nodeId,
            updatedConditions,
          );
        }

        // Update pages with fields and order
        for (const page of layoutPages) {
          const newPageId = oldPageIdToNew.get(page.id);
          if (!newPageId) continue;

          const fieldIds = (page.field_ids ?? [])
            .map((fieldId) => oldNodeIdToNew.get(fieldId))
            .filter(Boolean) as string[];

          await updatePageService(newPageId, {
            order: page.order,
            title: page.title,
            description: page.description,
            fields: fieldIds,
          });
        }

        await refreshForms();
        handleSuccess('Import Form Success');
        return createdForm.id;
      } catch (error) {
        handleError(error);
        return undefined;
      }
    },
    [refreshForms, replaceEdgeIdsInConditionString],
  );

  const clearAllFormPages = useCallback(
    async (pageIds: string[]) => {
      try {
        await Promise.all(pageIds.map((id) => deletePageService(id)));
        await refreshPages();
      } catch (error) {
        handleError(error);
      }
    },
    [refreshPages],
  );

  const value: FormBuilderContextType = {
    forms,
    selectedForm,
    pages,
    selectedPage,
    inputFieldNodes,
    refreshPages,
    addForm,
    getForm,
    updateForm,
    deleteForm,
    //
    addPage,
    getPage,
    updatePage,
    deletePage,
    //
    addPageConditions,
    updateCondition,
    deleteCondition,
    //
    updatePageOrder,
    exportForm,
    importForm,
    clearAllFormPages,
  };

  return (
    <FormBuilderContext.Provider value={value}>
      {children}
    </FormBuilderContext.Provider>
  );
}
