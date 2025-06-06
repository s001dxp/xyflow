import type { StyleValue } from 'vue';

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
