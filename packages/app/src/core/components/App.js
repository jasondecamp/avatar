import React from 'react';
import { Providers, RouteTree, generate } from '@avatar/library';
import { reducer } from '../reducer';
import { routeTree } from '../routes';

const store = generate.reduxStore(reducer);

export const App = () => {
  return (
    <Providers store={store}>
      <RouteTree routeTree={routeTree} defaultRoles={['guest']} />
    </Providers>
  );
};
