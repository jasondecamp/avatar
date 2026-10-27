import { createContext } from 'react';

// Shares the tooltip content's id with its trigger. Without a Tooltip root the id is undefined,
// so a Trigger or Content used on its own still renders, just unlinked.
export const TooltipContext = createContext({ id: undefined });
