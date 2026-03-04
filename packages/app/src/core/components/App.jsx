import { Providers, RouteTree, generate } from '@avatar/library';
import { reducer } from '../reducer';
import { routeTree } from '../routes';

import './styles/App.scss';

const store = generate.reduxStore(reducer);

export const App = () => {
  return (
    <div className='app'>
      <Providers store={store}>
        <RouteTree routeTree={routeTree} defaultRoles={['guest']} />
      </Providers>
    </div>
  );
};
