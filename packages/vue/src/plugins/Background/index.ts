export { default as Background } from './Background.vue';

// Re-export the types inline instead of from types.ts file
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
  style?: any; // Using any to avoid Vue StyleValue import issues
  className?: string;
}
