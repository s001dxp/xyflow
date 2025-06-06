// General utility functions for Vue Flow
import type { Node, Edge } from '../types';

/**
 * Type guard to check if an element is a Node
 */
export function isNode(element: Node | Edge): element is Node {
  return 'position' in element;
}

/**
 * Type guard to check if an element is an Edge
 */
export function isEdge(element: Node | Edge): element is Edge {
  return 'source' in element && 'target' in element;
}

/**
 * Utility to get node dimensions with fallback
 */
export function getNodeDimensions(node: Node) {
  return node.dimensions || { width: 150, height: 50 };
}

/**
 * Utility to normalize class prop for Vue components
 */
export function normalizeClass(cls?: string | string[] | Record<string, boolean>): string {
  if (!cls) return '';
  
  if (typeof cls === 'string') {
    return cls;
  }
  
  if (Array.isArray(cls)) {
    return cls.join(' ');
  }
  
  return Object.entries(cls)
    .filter(([, value]) => value)
    .map(([key]) => key)
    .join(' ');
}

/**
 * Utility to check if a point is inside a rectangle
 */
export function pointInRect(
  point: { x: number; y: number },
  rect: { x: number; y: number; width: number; height: number }
): boolean {
  return (
    point.x >= rect.x &&
    point.x <= rect.x + rect.width &&
    point.y >= rect.y &&
    point.y <= rect.y + rect.height
  );
}

/**
 * Utility to get the center point of a rectangle
 */
export function getRectCenter(rect: { x: number; y: number; width: number; height: number }) {
  return {
    x: rect.x + rect.width / 2,
    y: rect.y + rect.height / 2
  };
}
