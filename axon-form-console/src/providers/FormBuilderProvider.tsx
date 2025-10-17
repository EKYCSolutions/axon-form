import {
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
  createEdge as createEdgeService,
  createNode as createNodeService,
  createPage as createPageService,
  deleteCondition as deleteConditionService,
  deleteNode as deleteNodeService,
  deletePage as deletePageService,
  getAllConditionGroups as getAllConditionGroupsService,
  getAllConditionsFromNode as getAllConditionsFromNodeService,
  getAllInputFieldNodes as getAllInputFieldNodesService,
  getAllNodes as getAllNodesService,
  getAllPages as getAllPagesService,
  getPageById as getPageByIdService,
  getPageNode as getPageNodeService,
  getValueNodes as getValueNodesService,
  updateCondition as updateConditionService,
  updateEdge as updateEdgeService,
  updateNode as updateNodeService,
  updatePageOrder as updatePageOrderService,
  updatePage as updatePageService,
} from '@/services/PocketBaseService';
import type { EdgeConditionGroup, GraphEdge, GraphNode } from '@/types/Graph';
import { parseNodeResponse, type Node, type NodeBody } from '@/types/Node';
import type { Page, PageBody } from '@/types/Page';
import type { EdgeResponse, NodeResponse } from '@/types/PocketBaseResponse';
import { exportJSON } from '@/utils/File';
import { getFieldArrayChanges } from '@/utils/Form';
import { convertGraphToJSON } from '@/utils/Graph';
import { handleError, handleSuccess } from '@/utils/Toast';
import type { ConditionFormSchemaData } from '@/validations/ConditionValidation';
import type { EdgeFormSchemaData } from '@/validations/EdgeValidation';
import {
  convertNodeResponseToGraphNode,
  type NodeFormSchemaData,
} from '@/validations/NodeValidation';
import type { PageConditionFormSchemaData } from '@/validations/PageConditionValidation';
import type { PageFormSchemaData } from '@/validations/PageFormValidation';
import type { SelectOptionFormSchemaData } from '@/validations/SelectOptionValidation';
import { useQueries, useQuery } from '@tanstack/react-query';
import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { validate } from 'uuid';

interface FormBuilderProviderProps {
  children: ReactNode;
}

export function FormBuilderProvider({ children }: FormBuilderProviderProps) {
  const [selectedPageId, setSelectedPageId] = useState<string>();
  const [fetchInputFieldNodes, setFetchInputFieldNodes] =
    useState<boolean>(false);

  // Query: Fetch all pages
  const { data: pagesData, refetch: refreshPages } = useQuery({
    queryKey: ['pages'],
    queryFn: getAllPagesService,
  });

  // Query: Fetch single page details
  const { data: singlePageData } = useQuery({
    queryKey: ['page', selectedPageId],
    queryFn: () => getPageByIdService(selectedPageId!),
    enabled: !!selectedPageId,
  });

  // Query: Fetch field conditions
  const { data: fieldConditionsData } = useQuery({
    queryKey: ['fieldConditions', selectedPageId],
    queryFn: () => getAllConditionsFromNodeService(selectedPageId!),
    enabled: !!selectedPageId,
  });

  // Query: Fetch all nodes (lazy)
  const { refetch: fetchNodes } = useQuery({
    queryKey: ['nodes'],
    queryFn: () => getAllNodesService(),
    enabled: false,
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

  // Transform pages data
  const pages = useMemo(() => {
    if (!pagesData) return [];

    return pagesData
      .map((page) => ({
        id: page.id,
        order: page.order,
        title: page.title,
        description: page.description,
        fields: page.expand.fields.map(parseNodeResponse),
      }))
      .sort((a, b) => a.order - b.order);
  }, [pagesData]);

  // Transform selected page data
  const selectedPageData: Page | undefined = useMemo(() => {
    if (!singlePageData || !pageNodeData) return undefined;

    return {
      id: singlePageData.id,
      node_id: pageNodeData.id,
      order: singlePageData.order,
      title: singlePageData.title,
      description: singlePageData.description,
      fields: singlePageData.expand.fields.map(parseNodeResponse),
    };
  }, [singlePageData, pageNodeData]);

  // Get field IDs that need options fetched
  const fieldIdsWithOptions = useMemo(() => {
    if (!selectedPageData) return [];

    return selectedPageData.fields
      .filter((field) =>
        NodeFieldTypeWithOptions.includes(field.field_type as NodeFieldType),
      )
      .map((field) => field.id);
  }, [selectedPageData]);

  // Fetch options for all matching fields
  const optionsQueries = useQueries({
    queries: fieldIdsWithOptions.map((fieldId) => ({
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
        expected_value: cond.expected_value,
        expression: cond.expression,
        target_node_id: cond.target_node_id,
      })),
      fields: selectedPageData.fields.map((field) => {
        // Update conditions
        const conditions = fieldConditionsData
          ?.filter((cond) => cond.target_node_id === field.id)
          .map((cond) => ({
            id: cond.id,
            edge: cond.edge,
            check_node: cond.check_node,
            expected_value: cond.expected_value,
            expression: cond.expression,
            target_node_id: cond.target_node_id,
          }));

        // Find field with options
        const fieldIndex = fieldIdsWithOptions.indexOf(field.id);
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

  // Helper: Add value node with edge
  const addValueNode = useCallback(
    async (
      pageId: string,
      parentNodeId: string,
      option: SelectOptionFormSchemaData,
    ) => {
      try {
        const valueNodeData: NodeBody = {
          page: pageId,
          type: NodeType.Value,
          label: option.label,
          value: option.value,
          field_name: undefined,
          field_type: undefined,
          validation_rules: [],
        };

        const addValueNodeRes = await createNodeService(valueNodeData);

        const hasOptionEdgeData: EdgeFormSchemaData = {
          label: '',
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
    async (targetNodeId: string, condition: ConditionFormSchemaData) => {
      try {
        const showEdgeData: EdgeFormSchemaData = {
          label: '',
          source_node: condition.check_node_id!,
          target_node: targetNodeId,
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
          page: pageId,
          field_name: data.field_name,
          field_type: data.field_type,
          label: data.label,
          value: data.default_value,
          type: data.type,
          validation_rules: data.validation_rules ?? [],
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

          if (addedConditions.length > 0) {
            addedConditions.forEach((cond) => addCondition(id, cond));
          }

          if (deletedConditions.length > 0) {
            deletedConditions.forEach((cond) => deleteCondition(cond.id));
          }

          if (updatedConditions.length > 0) {
            updatedConditions.forEach((cond) => updateCondition(cond.id, cond));
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
            addedSelectOptions.forEach((node) =>
              addValueNode(pageId, id, node),
            );
          }

          if (deletedSelectOptions.length > 0) {
            deletedSelectOptions.forEach((node) => deleteNode(node.id));
          }

          if (updatedSelectOptions.length > 0) {
            updatedSelectOptions.forEach((node) =>
              updateNodeService(node.id, node),
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

        const fieldId = nodeIdMap[field.id as string];

        await Promise.all(
          field.conditions.map((cond) => {
            const conditionData = {
              ...cond,
              node_id: nodeIdMap[cond.check_node_id as string],
            };
            return addCondition(fieldId, conditionData);
          }),
        );
      }
    },
    [addCondition],
  );

  // API: Add page
  const addPage = useCallback(
    async (data: PageFormSchemaData) => {
      try {
        const pageRes = await createPageService(data);
        await createNodeService({
          type: NodeType.Page,
          page: pageRes.id,
          field_name: undefined,
          field_type: undefined,
          label: undefined,
          value: undefined,
          validation_rules: [],
        });

        const nodeIds = await Promise.all(
          data.fields.map(async (field) => {
            const res = await addNode(field, pageRes.id);
            return res!.id;
          }),
        );

        const nodeIdMap = createNodeIdMap(data.fields, nodeIds);
        await processFieldConditions(data.fields, nodeIdMap);

        const updatePageBody: PageBody = {
          order: undefined,
          title: data.title,
          description: data.description,
          fields: nodeIds,
        };

        await updatePageService(pageRes.id, updatePageBody);
        handleSuccess('Add Page Success');
        await refreshPages();
      } catch (error) {
        handleError(error);
      }
    },
    [addNode, processFieldConditions, refreshPages],
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

        if (newFields.length > 0) {
          const newFieldIdsRes = await Promise.all(
            newFields.map(async (field) => {
              const res = await addNode(field, id);
              return res!.id;
            }),
          );

          const nodeIdMap = createNodeIdMap(newFields, newFieldIdsRes);
          await processFieldConditions(newFields, nodeIdMap);

          fieldIds.push(...newFieldIdsRes);
        }

        const updatePageBody: PageBody = {
          order: undefined,
          title: data.title,
          description: data.description,
          fields: fieldIds,
        };

        await updatePageService(id, updatePageBody);
        handleSuccess('Update Page Success');
      } catch (err) {
        handleError(err);
      }
    },
    [addNode, updateNode, processFieldConditions],
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
            return addCondition(pageNodeId, conditionData);
          }),
        );
        handleSuccess('Add Page Conditions Success');
      } catch (err) {
        handleError(err);
      }
    },
    [],
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
        handleSuccess('Update Page Conditions Success');
      } catch (err) {
        handleError(err);
      }
    },
    [],
  );

  // API: Delete condition
  const deleteCondition = useCallback(async (conditionId: string) => {
    try {
      await deleteConditionService(conditionId);
      handleSuccess('Delete Page Conditions Success');
    } catch (err) {
      handleError(err);
    }
  }, []);

  // API: Update page order
  const updatePageOrder = useCallback(async (pages: Page[]) => {
    try {
      await Promise.all(
        pages.map((page) =>
          updatePageOrderService(page.id, { order: page.order }),
        ),
      );
    } catch (err) {
      handleError(err);
    }
  }, []);

  // Helper: Parse edges from nodes
  const parseEdges = useCallback((nodes: GraphNode[]): GraphEdge[] => {
    const nodeIds = new Set(nodes.map((node) => node.id));
    const edgeMap = new Map<string, GraphEdge>();

    nodes.forEach((node) => {
      node.edges.forEach((edge) => {
        if (
          !edgeMap.has(edge.id) &&
          nodeIds.has(edge.from) &&
          nodeIds.has(edge.to)
        ) {
          edgeMap.set(edge.id, edge);
        }
      });
    });

    return Array.from(edgeMap.values());
  }, []);

  // API: Export form
  const exportForm = useCallback(
    async (fileName: string) => {
      try {
        const { data: nodesData } = await fetchNodes();
        const { data: conditionGroupsData } = await fetchConditionGroups();

        if (!nodesData) return;

        const nodes = nodesData.map(convertNodeResponseToGraphNode);
        const edges = parseEdges(nodes);
        const conditionGroups: EdgeConditionGroup[] = (
          conditionGroupsData ?? []
        ).map((cd) => ({
          id: cd.id,
          node: cd.node,
          conditions: cd.conditions,
        }));

        const json = convertGraphToJSON(nodes, edges, conditionGroups, pages);
        exportJSON(json, fileName);
      } catch (err) {
        handleError(err);
      }
    },
    [pages, fetchNodes, fetchConditionGroups, parseEdges],
  );

  const value: FormBuilderContextType = {
    pages,
    selectedPage,
    inputFieldNodes,
    refreshPages,
    addPage,
    getPage,
    updatePage,
    deletePage,
    addPageConditions,
    updateCondition,
    deleteCondition,
    updatePageOrder,
    exportForm,
  };

  return (
    <FormBuilderContext.Provider value={value}>
      {children}
    </FormBuilderContext.Provider>
  );
}
