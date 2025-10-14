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
  getAllConditionGroups,
  getAllNodes,
  getAllPages,
  getPageById,
  getValueNodes,
  updateNode,
  updatePageOrder as updatePageOrderService,
  updatePage as updatePageService,
} from '@/services/PocketBaseService';
import type { EdgeConditionGroup, GraphEdge, GraphNode } from '@/types/Graph';
import { parseNodeResponse } from '@/types/Node';
import type { Page } from '@/types/Page';
import type { EdgeResponse, NodeResponse } from '@/types/PocketBaseResponse';
import { exportJSON } from '@/utils/File';
import { convertGraphToJSON } from '@/utils/Graph';
import { handleError, handleSuccess } from '@/utils/Toast';
import type { ConditionFormSchemaData } from '@/validations/ConditionValidation';
import type { EdgeFormSchemaData } from '@/validations/EdgeValidation';
import {
  convertNodeResponseToGraphNode,
  type NodeFormSchemaData,
} from '@/validations/NodeValidation';
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

  // Fetch all pages
  const { data: pagesData, refetch: refreshPages } = useQuery({
    queryKey: ['pages'],
    queryFn: getAllPages,
  });

  // Fetch single page details
  const { data: singlePageData } = useQuery({
    queryKey: ['page', selectedPageId],
    queryFn: () => getPageById(selectedPageId!),
    enabled: !!selectedPageId,
  });

  //
  const { refetch: fetchNodes } = useQuery({
    queryKey: ['nodes'],
    queryFn: () => getAllNodes(),
    enabled: false,
  });

  //
  const { refetch: fetchConditionGroups } = useQuery({
    queryKey: ['conditionGroups'],
    queryFn: () => getAllConditionGroups(),
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
    if (!singlePageData) return undefined;

    return {
      id: singlePageData.id,
      order: singlePageData.order,
      title: singlePageData.title,
      description: singlePageData.description,
      fields: singlePageData.expand.fields.map(parseNodeResponse),
    };
  }, [singlePageData]);

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
      queryFn: () => getValueNodes(fieldId),
      enabled: !!fieldId,
    })),
  });

  const isAllOptionsLoading = optionsQueries.some((query) => query.isLoading);

  // Combine selected page with options
  const selectedPage: Page | undefined = useMemo(() => {
    if (!selectedPageData || isAllOptionsLoading) return undefined;

    return {
      ...selectedPageData,
      fields: selectedPageData.fields.map((field) => {
        const fieldIndex = fieldIdsWithOptions.indexOf(field.id);

        if (fieldIndex === -1) return field;

        const optionsData = optionsQueries[fieldIndex]?.data;

        return {
          ...field,
          options: optionsData
            ? optionsData.map((option) => ({
                label: option.label,
                value: option.value,
              }))
            : [],
        };
      }),
    };
  }, [
    selectedPageData,
    isAllOptionsLoading,
    fieldIdsWithOptions,
    optionsQueries,
  ]);

  // Add edge
  const addEdge = useCallback(
    async (data: EdgeFormSchemaData): Promise<EdgeResponse | undefined> => {
      try {
        const edgeRes = await createEdgeService(data);
        return edgeRes;
      } catch (error) {
        handleError(error);
        return undefined;
      }
    },
    [],
  );

  // Add value node with edge
  const addValueNode = useCallback(
    async (parent_node_id: string, option: SelectOptionFormSchemaData) => {
      try {
        const valueNodeData: NodeFormSchemaData = {
          type: NodeType.Value,
          label: option.label,
          default_value: option.value,
        };

        const addValueNodeRes = await createNodeService(valueNodeData);

        const hasOptionEdgeData: EdgeFormSchemaData = {
          label: '',
          source_node: parent_node_id,
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

  const addCondition = useCallback(
    async (target_node_id: string, condition: ConditionFormSchemaData) => {
      try {
        const showEdgeData: EdgeFormSchemaData = {
          label: '',
          source_node: condition.node_id!,
          target_node: target_node_id,
          type: EdgeType.Shows,
        };

        const edgeRes = await addEdge(showEdgeData);

        const conditionData = condition;
        condition.edge = edgeRes?.id;
        await createCondition(conditionData);
      } catch (error) {
        handleError(error);
      }
    },
    [addEdge],
  );

  // Add node
  const addNode = useCallback(
    async (data: NodeFormSchemaData): Promise<NodeResponse | undefined> => {
      try {
        const addNodeRes = await createNodeService(data);

        // Add value nodes if select options exist
        if (data.select_options?.length) {
          await Promise.all(
            data.select_options.map((option) =>
              addValueNode(addNodeRes.id, option),
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

  // Add page
  const addPage = useCallback(
    async (data: PageFormSchemaData) => {
      try {
        console.log('page schema >>', data);
        console.log(
          'field id >>',
          data.fields.map((field) => validate(field.id!)),
        );

        const nodeIds = await Promise.all(
          data.fields.map(async (field) => {
            const res = await addNode(field);
            return res!.id;
          }),
        );

        const nodeIdMap = data.fields.reduce(
          (acc, field, idx) => {
            acc[field.id as string] = nodeIds[idx];
            return acc;
          },
          {} as Record<string, string>,
        );

        console.log('node id map >>', nodeIdMap);

        for (const field of data.fields) {
          if (field.conditions) {
            const fieldId = nodeIdMap[field.id as string];

            field.conditions.map((cond) => {
              const conditionData = cond;
              cond.node_id = nodeIdMap[cond.node_id as string];

              addCondition(fieldId, conditionData);
            });
          }
        }

        await createPageService(data, nodeIds);
        handleSuccess('Add Page Success');
        await refreshPages();
      } catch (error) {
        handleError(error);
      }
    },
    [addNode, addCondition, refreshPages],
  );

  // Get page by ID
  const getPage = useCallback((id: string) => {
    setSelectedPageId(id);
  }, []);

  //
  const updatePage = useCallback(
    async (id: string, data: Partial<PageFormSchemaData>) => {
      try {
        const updateBody: Partial<PageFormSchemaData> = {
          title: data.title,
          description: data.description,
        };

        if (!data.fields) {
          return;
        }

        const fieldIds = [];

        // Get all existing field ids
        const existingFields = data.fields.filter((field) => field.id);
        //
        if (existingFields) {
          await Promise.all(
            existingFields.map(async (field) => {
              await updateNode(field.id!, field);
            }),
          );
          //
          fieldIds.push(...existingFields.map((field) => field.id!));
        }

        // Get new fields
        const newFields = data.fields?.filter((field) => !field.id);

        // Create node for each of the new fields
        if (newFields) {
          const newFieldIdsRes = await Promise.all(
            newFields.map(async (field) => {
              const res = await addNode(field);
              return res?.id;
            }),
          );

          const newFieldIds = newFieldIdsRes.filter(
            (id): id is string => typeof id === 'string',
          );

          fieldIds?.push(...newFieldIds);
        }

        //
        updatePageService(id, updateBody, fieldIds);
        handleSuccess('Update Page Success');
      } catch (err) {
        handleError(err);
      }
    },
    [addNode],
  );

  //
  const updatePageOrder = useCallback(async (pages: Page[]) => {
    try {
      await Promise.all(
        pages.map(
          async (page) =>
            await updatePageOrderService(page.id, {
              order: page.order,
            }),
        ),
      );
    } catch (err) {
      handleError(err);
    }
  }, []);

  //
  const exportForm = useCallback(
    async (fileName: string) => {
      try {
        const { data: nodesData } = await fetchNodes();
        const { data: conditionGroupsData } = await fetchConditionGroups();

        const nodes = nodesData?.map((node) =>
          convertNodeResponseToGraphNode(node),
        );

        if (!nodes) {
          return;
        }

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
    [pages],
  );

  const parseEdges = (nodes: GraphNode[]) => {
    const nodeIds = nodes.map((node) => node.id);
    const edgeRes: GraphEdge[] = nodes
      .filter((node) => node.edges.length > 0)
      .flatMap((node) => node.edges);
    const ids = new Set();
    const uniqueEdges = edgeRes.filter(({ id }) => !ids.has(id) && ids.add(id));
    return uniqueEdges.filter(
      (edge) => nodeIds.includes(edge.from) && nodeIds.includes(edge.to),
    );
  };

  const value: FormBuilderContextType = {
    pages,
    selectedPage,
    refreshPages,
    addPage,
    getPage,
    updatePage,
    updatePageOrder,
    exportForm,
  };

  return (
    <FormBuilderContext.Provider value={value}>
      {children}
    </FormBuilderContext.Provider>
  );
}
