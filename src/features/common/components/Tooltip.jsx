import { useId, useMemo } from 'react';

import { TooltipContext } from './TooltipContext';
import { TooltipTrigger } from './TooltipTrigger';
import { TooltipContent } from './TooltipContent';
import CSS from './styles/Tooltip.module.scss';

// CSS-only tooltip: Content shows above the Trigger on hover (pointer devices only) and keyboard focus.
export const Tooltip = ({ children }) => {
  const id = useId();
  const context = useMemo(() => ({ id }), [id]);

  return (
    <TooltipContext.Provider value={context}>
      <span className={CSS.tooltip}>{children}</span>
    </TooltipContext.Provider>
  );
};

Tooltip.Trigger = TooltipTrigger;
Tooltip.Content = TooltipContent;
