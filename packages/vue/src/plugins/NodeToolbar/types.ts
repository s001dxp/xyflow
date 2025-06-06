import type { CSSProperties } from 'vue';
import type { Position, Align } from '@xyflow/system';

/**
 * NodeToolbar component props for Vue Flow
 */
export interface NodeToolbarProps {
  /** The id of the node, or array of ids the toolbar should be displayed at */
  nodeId?: string | string[];
  /** Position of the toolbar relative to the node */
  position?: Position;
  /** Align the toolbar relative to the node */
  align?: Align;
  /** Offset the toolbar from the node */
  offset?: number;
  /** If true, node toolbar is visible even if node is not selected */
  isVisible?: boolean;
  /** CSS class name for the toolbar */
  className?: string;
  /** CSS styles for the toolbar */
  style?: CSSProperties;
}
