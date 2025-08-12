import { NodeType } from '@/configs/graph';

/**
 * Generates a random RGB color string.
 *
 * @param seed - Optional seed for reproducible random colors.
 * @returns A string representing a random RGB color (e.g., "rgb(255, 255, 255)").
 */
export function generateRandomRgbColor(nodeType?: NodeType): string {
  const colorPalette = {
    [NodeType.Input]: 'rgb(173, 216, 230)', // Light Blue
    [NodeType.Value]: 'rgb(255, 223, 186)', // Light Orange
  };

  if (nodeType && colorPalette[nodeType]) {
    return colorPalette[nodeType];
  }

  // Fallback for unknown node types or if no nodeType is provided
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);

  return `rgb(${r}, ${g}, ${b})`;
}
