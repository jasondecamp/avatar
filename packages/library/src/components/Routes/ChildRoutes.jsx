import React from 'react';
import { Route, Switch, Redirect, useLocation } from 'react-router-dom';
import { RenderRoutes } from './RenderRoutes';

const renderRoute = (route, contextPath, location, props) => {
  let routeFullPath = `${contextPath}${route.path}`.replace(/\/+/g, '/');
  if (route.redirect) {
    return (
      <Redirect
        key={routeFullPath}
        from={routeFullPath}
        to={route.to}
        exact={route.exact}
        push={route.push}
      />
    );
  } else if (route.component) {
    const Component = route.component;
    return (
      <Route
        key={routeFullPath}
        path={routeFullPath}
        exact={route.exact}
        render={routeRenderProps => (
          <Component parent={contextPath} {...routeRenderProps} {...route.passProps} {...props}>
            {route.children && (
              <RenderRoutes
                routes={route.children}
                basePath={routeRenderProps.match.path}
                location={location}
                {...props}
              />
            )}
          </Component>
        )}
      />
    );
  } else if (route.children) {
    return route.children.map(child => renderRoute(child, routeFullPath, location, props));
  }
};

export const ChildRoutes = ({routes, basePath, location, ...passProps}) => {
  let contextLocation = useLocation();
  if(!location) location = contextLocation;
  return (
    <Switch location={location}>
      {routes.map(route => renderRoute(route, basePath, location, passProps))}
    </Switch>
  );
};
