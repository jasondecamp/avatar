import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { throttle } from 'lodash';
import { createLogger } from 'redux-logger';

// build timestamp injected by Vite at serve/build time
const buildVersion = __BUILD_VERSION__;

const middlewares = [
  thunk
];

if (import.meta.env.DEV) {
  const logger = createLogger({ collapsed: true });
  middlewares.push(logger);
}

const loadLocalState = () => {
  try {
    const serializedState = localStorage.getItem('state');
    if (serializedState === null) return;
    const parsedState = JSON.parse(serializedState);
    if (parsedState.version === buildVersion) return parsedState; // only use stored state if version matches
    else {
      localStorage.removeItem('state'); // else clear the stored state
      return;
    }
  } catch (err) {
    return;
  }
};

const saveLocalState = (state) => {
  try {
    let localState = JSON.parse(JSON.stringify(state));
    delete localState.requests;
    localState.version = buildVersion; // append the build version for later comparison
    const serializedState = JSON.stringify(localState);
    localStorage.setItem('state', serializedState);
  } catch {
    // ignore write errors
  }
};

export const reduxStore = (reducers) => {
  const store = createStore(
    reducers,
    loadLocalState(),
    applyMiddleware(...middlewares)
  );

  store.subscribe(throttle(() => {
    saveLocalState(
      store.getState()
    );
  }, 1000));

  return store;
};
