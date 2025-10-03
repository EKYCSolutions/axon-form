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
  createEdge as createEdgeService,
  createNode as createNodeService,
  createPage as createPageService,
  getAllPages,
  getPageById,
  getValueNodes,
} from '@/services/PocketBaseService';
import { parseNodeResponse } from '@/types/Node';
import type { Page } from '@/types/Page';
import { handleError, handleSuccess } from '@/utils/Toast';
import type { EdgeFormSchemaData } from '@/validations/EdgeValidation';
import { type NodeFormSchemaData } from '@/validations/NodeValidation';
import type { PageFormSchemaData } from '@/validations/PageFormValidation';
import type { SelectOptionFormSchemaData } from '@/validations/SelectOptionValidation';
import { useQueries, useQuery } from '@tanstack/react-query';
import { useCallback, useMemo, useState, type ReactNode } from 'react';

interface FormBuilderProviderProps {
  children: ReactNode;
}

export function FormBuilderProvider({ children }: FormBuilderProviderProps) {
  const [selectedPageId, setSelectedPageId] = useState<string>();

  // Fetch all pages
  const { data: pagesData } = useQuery({
    queryKey: ['pages'],
    queryFn: getAllPages,
  });

  // Fetch single page details
  const { data: singlePageData } = useQuery({
    queryKey: ['page', selectedPageId],
    queryFn: () => getPageById(selectedPageId!),
    enabled: !!selectedPageId,
  });

  // Transform pages data
  const pages = useMemo(() => {
    if (!pagesData) return [];

    return pagesData.map((page) => ({
      id: page.id,
      title: page.title,
      description: page.description,
      fields: page.expand.fields.map(parseNodeResponse),
    }));
  }, [pagesData]);

  // Transform selected page data
  const selectedPageData: Page | undefined = useMemo(() => {
    if (!singlePageData) return undefined;

    return {
      id: singlePageData.id,
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
  const addEdge = useCallback(async (data: EdgeFormSchemaData) => {
    try {
      await createEdgeService(data);
    } catch (error) {
      handleError(error);
    }
  }, []);

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

  // Add node
  const addNode = useCallback(
    async (data: NodeFormSchemaData) => {
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
      }
    },
    [addValueNode],
  );

  // Add page
  const addPage = useCallback(
    async (data: PageFormSchemaData) => {
      try {
        const nodeIds = await Promise.all(
          data.fields.map(async (field) => {
            const res = await addNode(field);
            return res?.id;
          }),
        );

        const nodeIdsFiltered = nodeIds.filter(
          (id): id is string => id !== undefined,
        );

        if (nodeIdsFiltered.length === 0) {
          handleError('Failed to create page');
          return;
        }

        await createPageService(data, nodeIdsFiltered);
        handleSuccess('Add Page Success');
      } catch (error) {
        handleError(error);
      }
    },
    [addNode],
  );

  // Get page by ID
  const getPage = useCallback((id: string) => {
    setSelectedPageId(id);
  }, []);

  const value: FormBuilderContextType = {
    pages,
    selectedPage,
    addPage,
    getPage,
  };

  return (
    <FormBuilderContext.Provider value={value}>
      {children}
    </FormBuilderContext.Provider>
  );
}
