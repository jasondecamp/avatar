import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import { ServicesProvider } from '../../contexts';

export const Providers = ({children, store, ...props}) => {
  return (
    <ReduxProvider store={store}>
      <BrowserRouter>
        <ServicesProvider {...props}>
          { children }
        </ServicesProvider>
      </BrowserRouter>
    </ReduxProvider>
  );
};
