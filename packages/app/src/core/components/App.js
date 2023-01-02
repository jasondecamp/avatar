import { Icon } from '@starter/ui';

import CSS from './styles/App.module.css';

export const App = () => {
  return (
    <div className={CSS.app}>
      <header className={CSS.app_header}>
        <Icon size='large'/>
        <p>
          Edit <code>src/core/components/App.js</code> and save to reload.
        </p>
      </header>
    </div>
  );
}
