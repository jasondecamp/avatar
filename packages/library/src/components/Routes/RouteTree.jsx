import React, { useEffect } from 'react';
import { get } from 'lodash';

import { RenderRoutes } from './RenderRoutes';

const formatRouteTree = (routeTree=[], defaultRoles, hasRole) => {
  return routeTree
    // handle route defaults and conveniences
    .map(route => {
      if(!route.restrict) route.restrict = [...defaultRoles];
      if(route.allowGuest === true && !route.restrict.includes('guest')) route.restrict.push('guest');
      return route;
    })
    // remove invalid routes
    .filter(route => route.component || route.redirect || (route.children && route.children.length > 0))
    // remove routes that can't be accessed
    .filter(route => get(route,'restrict',[]).find(role => hasRole(role)))
    // recurse to filter children routes
    .map(route => {
      if(route.children) route.children = formatRouteTree(route.children, defaultRoles, hasRole);
      return route;
    });
};

export const RouteTree = ({ routeTree, defaultRoles=[], basePath='' }) => {
  const routes = formatRouteTree(routeTree, defaultRoles, () => true);
  return (
    <RenderRoutes routes={routes} basePath={basePath} />
  );
}
