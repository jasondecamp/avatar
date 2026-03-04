import React from 'react';

import CSS from './styles/LayoutBasic.module.scss';

export const LayoutBasic = ({ children }) => {
  return (
    <div className={CSS.layout}>
     {children}
   </div>
  );
}
