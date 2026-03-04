import { LayoutBasic } from '../common';
import { Builder } from './components/Builder';

const routes = [
  {
    path: '/',
    name: 'LayoutBasic',
    component: LayoutBasic,
    children: [
      {
        path: '/',
        name: 'Builder',
        component: Builder,
        exact: true,
      },
    ]
  },
]

export default routes;
