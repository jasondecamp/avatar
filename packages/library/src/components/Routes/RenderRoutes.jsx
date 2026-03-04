import React from 'react';
import { useLocation, matchPath } from 'react-router-dom';
import { get, isNil } from 'lodash';
// import { Transitions } from '@moved/ui';
import { ChildRoutes } from './ChildRoutes';

export const RenderRoutes = (props) => {
  const location = useLocation();

  let activeRoute = {};
  let params = {};

  props.routes.some(route => {
    let routeFullPath = `${props.basePath}${route.path}`.replace(/\/+/g, '/');
    const match = matchPath(location.pathname, { path: routeFullPath, exact: route.exact });
    if(match) {
      activeRoute = route;
      params = match.params;
      return true;
    }
    return false;
  });

  const activeTransition = !isNil(get(location,'state.transition')) ? get(location,'state.transition') : activeRoute.transition;

  let pageKey = (activeRoute.viewKey && activeRoute.viewKey(params)) || location.key;

  return (
    <ChildRoutes location={location} { ...props } />
  );

  // return (
  //   <Transitions
  //     pageKey={pageKey}
  //     {...location.state}
  //     transition={activeTransition}
  //   >
  //     {transitionState => (
  //       <ChildRoutes location={location} { ...props } transitionState={transitionState} />
  //     )}
  //   </Transitions>
  // )
};
