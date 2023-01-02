/*
*  Convenience generator for creating simple boilerplate action/reducer pairs
*   Features:
*   - Automatically creates `[namespace]_PENDING` records in state.requests and keeps them updated
*   - Automatically creates standard redux event dispatching and handling via reducers
*   - Automatically creates selector pairs for the resource and the pending state
*
*  Params:
*    namespace: [STRING]    unique string for identifying actions ie. '[FEATURE]_[ACTION_NAME]'
*    request:   [FUNCTION]  HOW TO LOAD THE RESOURCE
*                           the async action to call (usually a call to an axios request)
*    selector:  [FUNCTION]  HOW TO FETCH THE RESOURCE FROM STORE
*                           (required if caching) a function that accepts (state, ...params)
*                           where state is required to be the first param
*                           and should be followed up by the same set of params as the request function
*                           and finds/returns the resource from state
*    reducers:  [OBJECT]    HOW TO UPDATE WITH THE RESOURCE IN STORE
*                           supports the keys `success`, `begin`, `failure` to handle updating state
*                           each key should be a function taking params (state, action)
*                           each key is optional and defaults to just updating the request portion of state
*    cache:     [BOOLEAN | OBJECT] (optional) true will default to `{minutes: 5}`
*                           supports any valid luxon object notation or luxon duration
*
*  Returns:
*    action:    [FUNCTION]  default actionCreator function
*    reducer:   [FUNCTION]  combined default reducer function
*    useResource:[FX]       custom hook wrapper of useSelector to retrieve the resource from redux
*    usePending: [FX]       custom hook wrapper of useSelector to retrieve the pending state of the request
*/

import { actionCreator } from './actionCreator';
import { actionTypes } from './actionTypes';
import { defaultReducer } from './reducer';
import { createSelector, createPendingSelector } from './selectors';

export const redux = ({namespace, request, selector, cache, reducers = {} }) => {
  const types = actionTypes(namespace);
  const action = actionCreator({ types, request, selector, cache });
  const reducer = defaultReducer({ namespace, types, reducers });
  const useResource = createSelector(selector);
  const usePending = createPendingSelector(namespace);
  return { action, reducer, useResource, usePending };
};
