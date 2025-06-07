// Component prop types for better TypeScript support
import type { StyleValue, CSSProperties } from 'vue';
import type { GetBezierPathParams } from '@xyflow/system';
import type { Node, Edge, Viewport, FitViewOptions, PanelPosition } from './index';

export interface EdgeTextProps {
  x: number;
  y: number;
  label?: string;
  labelStyle?: StyleValue;
  labelShowBg?: boolean;
  labelBgStyle?: StyleValue;
  labelBgPadding?: [number, number];
  labelBgBorderRadius?: number;
}

export interface VueFlowProviderProps {
  nodes?: Node[];
  edges?: Edge[];
  viewport?: Viewport;
}

export interface SimpleBezierEdgeProps extends GetBezierPathParams {
  id: string;
  style?: CSSProperties;
  selected?: boolean;
  animated?: boolean;
  markerEnd?: string;
  markerStart?: string;
}

export enum BackgroundVariant {
  Lines = 'lines',
  Dots = 'dots',
  Cross = 'cross'
}

export interface BackgroundProps {
  variant?: BackgroundVariant;
  gap?: number | [number, number];
  size?: number;
  lineWidth?: number;
  offset?: number;
  color?: string;
  style?: StyleValue;
  className?: string;
}

export interface ControlsProps {
  showZoom?: boolean;
  showFitView?: boolean;
  showInteractive?: boolean;
  fitViewOptions?: FitViewOptions;
  position?: PanelPosition;
  class?: string;
  style?: CSSProperties;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onFitView?: () => void;
  onInteractiveChange?: (interactiveStatus: boolean) => void;
}
