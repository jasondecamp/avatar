/*
* Custom wrapper for moved global app services
*
* As this context is an aggregator, the documentation for how to use each service
* will be found in each service context definition. Each included service
* can be accessed as an object from the useServices hook with each context API
* function being directly accessible i.e. Notify.success()
*
* This context exposes a set of global services:
*   Notify: Quick feedback message notification system
*   Modal: Load components as overlay content
*   Track: Send events to the tracking service (no current service)
*   Stripe: Loads stripe SDK and allows for collection of payments
*   Scroller: Defines a shared scroller element to bind listeners and trigger scrolling
*   Sentry: Loads Sentry SDK for error reporting management
*
* Use context hook for functional component
* example:
*    import { useServices } from '@moved/services';
*    const { Notify } = useServices();
*    const onSuccess = () => Notify.success('Success!');
*
* Use context provider component for wrapping the global application
* (not needed more than once per app, usually in the Root component)
* Supports exclusion of services via optional 'exclude' prop which expects
* an array of service names (e.g. ['Stripe']).
* example:
*    import { ServicesProvider } from '@moved/services';
*    render (
*      <ServicesProvider exclude={['Modal']}> ... </ServicesProvider>
*    )
*
*/

import React, { createContext, useContext } from "react";
import {
  NotifyProvider, useNotify,
  ModalProvider, ModalInstance, useModal,
  ScrollerProvider, useScroller,
} from './';

const ServicesContext = createContext();
const useServices = () => useContext(ServicesContext);

// declare list of services to wrap
const serviceProviderList = [
  {
    name: 'Scroller',
    provider: ScrollerProvider,
    hook: useScroller,
  },
  {
    name: 'Modal',
    provider: ModalProvider,
    hook: useModal,
  },
  {
    name: 'Notify',
    provider: NotifyProvider,
    hook: useNotify,
  },
];

const withServiceProviders = (Wrapped) => {
  return ({exclude=[], ...props}) => {
    return serviceProviderList
      .filter(service => !exclude.includes(service.name))
      .reduce((children, service) => {
        return (<service.provider>{children}</service.provider>);
      }, <Wrapped exclude={exclude} { ...props }/>);
  };
};

// define ServicesProvider as functional component
const ServicesProvider = withServiceProviders(({children, exclude=[], ...props}) => {
  // add each service to the context namespace
  const context = serviceProviderList
    .filter(service =>  service.hook && !exclude.includes(service.name))
    .reduce((list, service) => {
      return Object.assign(list, {[service.name]: service.hook()});
    }, {});

  return (
    <ServicesContext.Provider value={context}>
      { children }
      <ModalInstance />
    </ServicesContext.Provider>
  );
});

export { ServicesProvider, useServices };
