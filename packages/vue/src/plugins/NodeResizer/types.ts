import type { CSSProperties } from 'vue';
import type {
  ControlPosition,
  ResizeControlVariant,
  ResizeParamsWithDirection,
  ShouldResize,
  OnResizeStart,
  OnResize,
  OnResizeEnd,
} from '@xyflow/system';

/**
 * NodeResizer component props for Vue Flow
 */
export interface NodeResizerProps {
  /** The id of the node to attach the resizer to */
  nodeId?: string;
  /** Whether the resizer is visible */
  isVisible?: boolean;
  /** Class name for handle elements */
  handleClass?: string;
  /** Style for handle elements */
  handleStyle?: CSSProperties;
  /** Class name for line elements */
  lineClass?: string;
  /** Style for line elements */
  lineStyle?: CSSProperties;
  /** Color of the resize controls */
  color?: string;
  /** Minimum width of the node */
  minWidth?: number;
  /** Minimum height of the node */
  minHeight?: number;
  /** Maximum width of the node */
  maxWidth?: number;
  /** Maximum height of the node */
  maxHeight?: number;
  /** Whether to keep aspect ratio when resizing */
  keepAspectRatio?: boolean;
  /** Function to determine if resize should happen */
  shouldResize?: ShouldResize;
  /** Callback when resize starts */
  onResizeStart?: OnResizeStart;
  /** Callback during resize */
  onResize?: OnResize;
  /** Callback when resize ends */
  onResizeEnd?: OnResizeEnd;
}

/**
 * Props for individual resize control elements
 */
export interface ResizeControlProps {
  nodeId?: string;
  position: ControlPosition;
  variant?: ResizeControlVariant;
  class?: string;
  style?: CSSProperties;
  color?: string;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  keepAspectRatio?: boolean;
  shouldResize?: ShouldResize;
}
