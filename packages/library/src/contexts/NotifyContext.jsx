/*
* Custom service wrapper for moved notifications based on:
* https://www.iamhosseindhv.com/notistack
* Please refer to ^ documentation for all available options. This service
* is largely a wrapper that exposes the same api with custom defaults for our
* apps.
*
* The hook for this context `useNotify` provides the following functions:
*   default, success, error, warning, info
*
* Each of those functions supports the same arguments (content,options) and
* automatically maps the display variant type for convenience.
*
* This context exposes three exports to implement notify context
* See the examples below for how to implement each approach
*
* Use full context for class component
* example:
*    import { NotifyContext } from '@moved/services';
*    static contextType = NotifyContext;
*    const success = this.context.success;
*    const onSuccess = () => success('Success!');
*
* Use context hook for functional component
* example:
*    import { useNotify } from '@moved/services';
*    const { success } = useNotify();
*    const onSuccess = () => success('Success!');
*
* Use context provider component for wrapping the global application
* (not needed more than once per app, usually in the Root component)
* example:
*    import { NotifyProvider } from '@moved/services';
*    render (
*      <NotifyProvider> ... </NotifyProvider>
*    )
*/

import React, { createContext, useContext } from "react";
import { SnackbarProvider, useSnackbar } from 'notistack';

import { merge } from 'lodash';

// Default config
const snackbarDefaults = {
  anchorOrigin: { horizontal: 'center', vertical: 'top'},
  hideIconVariant: true,
};

const NotifyContext = createContext();
const useNotify = () => useContext(NotifyContext);

const withSnackbar = (Wrapped) => {
  return (props) => {
    return (
      <SnackbarProvider {...snackbarDefaults}>
        <Wrapped {...props} />
      </SnackbarProvider>
    );
  }
};

const defaultMsg = {
  default: 'Hello.',
  success: 'Congrats! You did it.',
  error: 'Uh oh. Something unexpected happened. Pardon our technical difficulties.',
  warning: 'Beware. Here be dragons.',
  info: 'Take heed noble sir.',
}

// define NotifyContextProvider as functional component
const NotifyProvider = withSnackbar(({ children }) => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const mapType = (type) => (content,opts) => enqueueSnackbar(content || defaultMsg[type], merge({variant:type}, opts));
  const context = {
    dismiss: key => closeSnackbar(key),
  };
  const supportedTypes = ['default','success','error','warning','info'];
  supportedTypes.forEach((type) => context[type] = mapType(type));
  return (
    <NotifyContext.Provider value={context}>{ children }</NotifyContext.Provider>
  );
});

export { NotifyContext, NotifyProvider, useNotify };
