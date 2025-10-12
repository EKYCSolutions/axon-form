import {
  ConditionGroupExpression,
  EdgeType,
  NodeFieldType,
} from '@/configs/graph';
import type { EdgeConditionGroup, GraphEdge, GraphNode } from '@/types/Graph';
import type { Page } from '@/types/Page';
import type { ConditionGroupFormSchemaData } from '@/validations/ConditionGroupValidation';
import { convertGraphEdgeToEdgeForm } from '@/validations/EdgeValidation';
import { convertGraphNodeToNodeForm } from '@/validations/NodeValidation';
import { convertPageToPageForm } from '@/validations/PageFormValidation';

export const convertConditionGroupToConditionString = (
  data: ConditionGroupFormSchemaData,
): string => {
  const parts: string[] = [];

  // Add edge IDs from current level
  if (data.edges && data.edges.length > 0) {
    // Get unique edge IDs (in case there are duplicates)
    const uniqueEdgeIds = [...new Set(data.edges.map((edge) => edge.id))];
    parts.push(...uniqueEdgeIds);
  }

  // Process children recursively
  if (data.children && data.children.length > 0) {
    for (const child of data.children) {
      const childExpression = convertConditionGroupToConditionString(child);

      // Wrap child expressions in parentheses if they contain operators
      if (child.expr && (child.edges.length > 1 || child.children)) {
        parts.push(`( ${childExpression} )`);
      } else {
        parts.push(childExpression);
      }
    }
  }

  // Join parts with the current node's operator
  if (parts.length > 1) {
    return parts.join(` ${data.expr.toUpperCase()} `);
  } else if (parts.length === 1) {
    return parts[0];
  } else {
    return '';
  }
};

export const convertConditionStringToConditionGroupObject = (
  conditionString: string,
): ConditionGroupFormSchemaData => {
  const POCKETBASE_ID_LENGTH = 15;

  // Trim whitespace
  let trimmed = conditionString.trim();

  if (trimmed.startsWith('(') && trimmed.endsWith(')')) {
    trimmed = trimmed.slice(1, -1);
  }

  //
  let expr: ConditionGroupExpression;
  let delimiter: string;

  if (trimmed.includes(' AND ')) {
    expr = ConditionGroupExpression.And;
    delimiter = ' AND ';
  } else if (trimmed.includes(' OR ')) {
    expr = ConditionGroupExpression.Or;
    delimiter = ' OR ';
  } else if (trimmed.includes(' NOR ')) {
    expr = ConditionGroupExpression.Nor;
    delimiter = ' NOR ';
  } else {
    throw Error('Invalid condition string');
  }
  // Split the string to get individual UUIDs
  const children = delimiter ? trimmed.split(delimiter) : [trimmed];

  //
  const edgeIds = children
    .map((child) => child.trim())
    .filter((child) => child.length <= POCKETBASE_ID_LENGTH);

  const conditionGroupChildren = children
    .map((child) => child.trim())
    .filter((child) => child.length > POCKETBASE_ID_LENGTH);

  //
  const edges: GraphEdge[] = edgeIds.map((id) => ({
    id: id,
    label: '',
    sourceNode: '',
    targetNode: '',
    from: '',
    to: '',
    edgeType: EdgeType.Shows,
  }));

  const conditionGroupChildrenObjects = conditionGroupChildren.map((child) =>
    convertConditionStringToConditionGroupObject(child),
  );

  return {
    node,
    expr,
    children: conditionGroupChildrenObjects,
    edges,
  };
};

export const convertGraphToJSON = (
  nodes: GraphNode[],
  edges: GraphEdge[],
  conditionGroups: EdgeConditionGroup[],
  pages: Page[],
): Record<string, unknown> => {
  //
  const nodeJson = nodes.map((node) => convertGraphNodeToNodeForm(node));
  const edgeJson = edges.map((edge) => convertGraphEdgeToEdgeForm(edge));
  const pageJson = pages.map((page) => convertPageToPageForm(page));

  return {
    layout: {
      pages: pageJson,
    },
    nodes: nodeJson,
    edges: edgeJson,
    condition_groups: conditionGroups,
  };
};

export const parseNodeFieldType = (type: string): NodeFieldType => {
  switch (type) {
    case 'text':
      return NodeFieldType.Text;
    case 'textarea':
      return NodeFieldType.TextArea;
    case 'number':
      return NodeFieldType.Number;
    case 'date':
      return NodeFieldType.Date;
    case 'multi_select':
      return NodeFieldType.MultiSelect;
    case 'select':
      return NodeFieldType.Select;
    case 'radio':
      return NodeFieldType.Radio;
    case 'dropdown':
      return NodeFieldType.Dropdown;
    case 'checkbox':
      return NodeFieldType.Checkbox;
    case 'file':
      return NodeFieldType.File;
    case 'password':
      return NodeFieldType.Password;

    default:
      return NodeFieldType.Text;
  }
};
