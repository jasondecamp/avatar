import { Children, cloneElement, useContext } from 'react';

import { TooltipContext } from './TooltipContext';

// The tooltip text is the trigger's accessible name, so the label is written once.
export const TooltipTrigger = ({ children }) => {
  const { id } = useContext(TooltipContext);
  return cloneElement(Children.only(children), { 'aria-labelledby': id });
};
