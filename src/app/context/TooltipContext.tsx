'use client';

import React, { createContext, ReactNode, useContext, useState } from 'react';

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

interface TooltipContextProps {
  tooltipState: TooltipState;
  setTooltipState: React.Dispatch<React.SetStateAction<TooltipState>>;
}

const TooltipContext = createContext<TooltipContextProps | undefined>(
  undefined
);

interface TooltipProviderProps {
  children: ReactNode;
}

export const TooltipProvider: React.FC<TooltipProviderProps> = ({
  children,
}) => {
  const [tooltipState, setTooltipState] = useState<TooltipState>({
    position: null,
    value: null,
    topic: '',
    content: null,
    group: '',
    child: null,
    minWidth: undefined,
    x: undefined,
    y: undefined,
  });

  const contextValue = React.useMemo(
    () => ({ tooltipState, setTooltipState }),
    [tooltipState, setTooltipState]
  );

  return (
    <TooltipContext.Provider value={contextValue}>
      {children}
    </TooltipContext.Provider>
  );
};

export const useTooltip = (): TooltipContextProps => {
  const context = useContext(TooltipContext);
  if (!context) {
    throw new Error('useTooltip must be used within a TooltipProvider');
  }
  return context;
};

export default TooltipContext;
