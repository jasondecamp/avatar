import React from 'react';
import { Icon, Button, useNotify } from '@avatar/library';

import CSS from './styles/Home.module.scss';

export const Home = () => {
  const Notify = useNotify();
  return (
    <div className={CSS.app}>
      <header className={CSS.app_header}>
        <Icon size='large'/>
        <Button label='Notify me' onClick={() => Notify.default('Hello!')} primary={true}/>
      </header>
    </div>
  );
}
