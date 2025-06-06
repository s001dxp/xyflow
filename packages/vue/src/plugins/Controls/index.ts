import Controls from './Controls.vue';

export { Controls };
export default Controls;

// Export types inline
export interface ControlsProps {
  showZoom?: boolean;
  showFitView?: boolean;
  showInteractive?: boolean;
  fitViewOptions?: any; // FitViewOptions type
  orientation?: 'horizontal' | 'vertical';
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  style?: any;
  className?: string;
}
