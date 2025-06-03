import { ReactNode } from 'react';

export interface TooltipState {
  position?: { x: number; y: number } | null;
  value?: number | null;
  topic?: string;
  content?: string | ReactNode | null;
  group?: string;
  child?: ReactNode | null;
  minWidth?: number;
  x?: number;
  y?: number;
}
