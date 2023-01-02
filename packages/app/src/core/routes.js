import homeRoutes from '../features/home/routes';
import builderRoutes from '../features/builder/routes';
import commonRoutes from '../features/common/routes';

export const routeTree = [
  ...homeRoutes,
  ...builderRoutes,
  ...commonRoutes // must be last
];
