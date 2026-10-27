import { useContext } from 'react';

import { TooltipContext } from './TooltipContext';
import CSS from './styles/Tooltip.module.scss';

export const TooltipContent = ({ children }) => {
  const { id } = useContext(TooltipContext);
  return <span id={id} role='tooltip' className={CSS.content}>{children}</span>;
};
