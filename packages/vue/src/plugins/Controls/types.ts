import type { PanelPosition, FitViewOptions } from '../../types';
import type { CSSProperties } from 'vue';

export interface ControlsProps {
  /**
   * Whether or not to show the zoom in and zoom out buttons. These buttons will adjust the viewport
   * zoom by a fixed amount each press.
   * @default true
   */
  showZoom?: boolean;
  /**
   * Whether or not to show the fit view button. By default, this button will adjust the viewport so
   * that all nodes are visible at once.
   * @default true
   */
  showFitView?: boolean;
  /**
   * Show button for toggling interactivity
   * @default true
   */
  showInteractive?: boolean;
  /**
   * Customise the options for the fit view button. These are the same options you would pass to the
   * fitView function.
   */
  fitViewOptions?: FitViewOptions;
  /** Called in addition the default zoom behavior when the zoom in button is clicked. */
  onZoomIn?: () => void;
  /** Called in addition the default zoom behavior when the zoom out button is clicked. */
  onZoomOut?: () => void;
  /**
   * Called when the fit view button is clicked. When this is not provided, the viewport will be
   * adjusted so that all nodes are visible.
   */
  onFitView?: () => void;
  /** Called when the interactive (lock) button is clicked. */
  onInteractiveChange?: (interactiveStatus: boolean) => void;
  /**
   * Position of the controls on the pane
   * @default 'bottom-left'
   * @example 'top-left', 'top-right', 'bottom-left', 'bottom-right'
   */
  position?: PanelPosition;
  /** Style applied to container */
  style?: CSSProperties;
  /** Class name applied to container */
  class?: string;
  /**
   * @default 'Vue Flow controls'
   */
  'aria-label'?: string;
  /**
   * @default 'vertical'
   */
  orientation?: 'horizontal' | 'vertical';
}
