import { GraphContext } from '@/contexts/GraphContext';
import { useContext } from 'react';

export function useGraph() {
  const context = useContext(GraphContext);
  if (context === undefined) {
    throw new Error('useGraph must be used within a GraphProvider');
  }
  return context;
}
