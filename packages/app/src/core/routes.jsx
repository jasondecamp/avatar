import builderRoutes from '../features/builder/routes';
import commonRoutes from '../features/common/routes';

export const routeTree = [
  ...builderRoutes,
  ...commonRoutes // must be last
];
