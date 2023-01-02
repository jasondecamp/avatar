/*
* This context exposes three exports to implement user context
* See the examples below for how to implement each approach
*
* Use full context for class component
* example:
*    import { UserContext } from '@moved/services';
*    static contextType = UserContext;
*    const user = this.context.user;
*
* Use context hook for functional component
* example:
*    import { useUser } from '@moved/services';
*    const { user } = useUser();
*
* Use context provider component for wrapping the global application
* (not needed more than once per app, usually in the Root component)
* example:
*    import { UserContextProvider } from '@moved/services';
*    render (
*      <UserContextProvider> ... </UserContextProvider>
*    )
*
*/

import React, { createContext, useContext, useState, useEffect } from 'react';
import { get } from 'lodash';
import { useDispatch } from 'react-redux';

import { userService, logoutAction } from '../services/userService';
import { request } from '../services/request';

const defaultUser = { role: 'guest', roles: [{ name: 'guest' }] };
const UserContext = createContext();
const useUser = () => useContext(UserContext);

let token = false,
    tokenExpiration = false,
    isProxy = false;

const getToken = () => ({
  token, tokenExpiration
});

const setToken = ({ access_token, access_token_expiration, access_token_is_proxy } = {}) => {
  token = access_token; // store locally
  tokenExpiration = access_token_expiration; // store locally
  isProxy = access_token_is_proxy;
  return setAuthHeaders();
};

// Convenience functions
const setAuthHeaders = () => {
  if(token) {
    request.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    return true; // there is a logged in user
  }
  else {
    delete request.defaults.headers.common['Authorization'];
    return false; // there is not a logged in user
  }
};

const refreshToken = () => {
  setToken(); // clear existing token before attemping to refresh
  return userService.refreshToken().then(setToken);
};

const UserContextProvider = ({ children }) => {
  // hooks
  const [state, setState] = useState();
  const dispatch = useDispatch();

  useEffect(() => { loadUser() },[]);

  // function for loading user data from server
  const loadUser = () => {
    return refreshToken()
      .then(isAuthenticated => {
        if(isAuthenticated) return userService.getUser().then(
          (user) => updateUser(user),
          (err) => logout(),
        );
        else return updateUser(false);
      })
      .catch(error => {
        if(get(error,'response.status') === 401) logout();
      });
  };

  // convenience function to check if active user has a specific role
  const hasRole = (role) => userService.hasRole(state.user,role);

  // function for setting user data and optionally tokens
  const updateUser = (user, tokenData) => {
    if(tokenData || !user) setToken(tokenData);
    setState({
      isAuthenticated: user ? true : false,
      user: (user || defaultUser),
      isProxy: isProxy,
    });
  };

  // convenience function for calling centralized logout business logic
  // (returns promise for chaining redirect or messaging)
  const logout = () => dispatch(logoutAction()).then(() => updateUser(false));

  const proxyAs = id => userService.proxyStart(id)
    .then(({ user, ...tokenData }) => {
      setToken(tokenData);
      window.localStorage.removeItem('state');
      userService.redirect(user);
    });

  const exitProxy = () => userService.proxyEnd()
    .then(({user,...tokenData}) => {
      setToken(tokenData);
      window.localStorage.removeItem('state');
      if(hasRole('vendor')) return window.top.location = `${process.env.REACT_APP_MOVED_APP_URL}/admin/vendors`;
      if(hasRole('customer')) return window.top.location = `${process.env.REACT_APP_ADMIN_APP_URL}/cx/moves?direct=${encodeURIComponent(get(state,'user.email'))}`;
      if(hasRole('partner')) {
        const partner_id = get(get(state,'user.roles',[]).find(role => role.name === 'partner'),'partner_id');
        return window.top.location = `${process.env.REACT_APP_ADMIN_APP_URL}/admin/admins?partner_ids=${partner_id}`;
      }
    });

  if (!state) return null;

  // map the context API
  const context = {
    ...state,
    hasRole, // TODO: give this a better name everywhere (selfHasRole or something)
    updateUser,
    logout,
    proxyAs,
    exitProxy,
  };

  return <UserContext.Provider value={context}>{children}</UserContext.Provider>;

};

export { UserContext, UserContextProvider, useUser, refreshToken, getToken };
