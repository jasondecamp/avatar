import { LayoutBasic } from '../../features/common';
import { Builder } from '../../features/builder';

import './styles/App.scss';

export const App = () => {
  return (
    <div className='app'>
      <LayoutBasic>
        <Builder />
      </LayoutBasic>
    </div>
  );
};
