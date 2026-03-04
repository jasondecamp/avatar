// Generator for mapping object declaration of reducer action types instead of switch statement
export const reducer = (handlers) => {
  return function reducer(state, action) {
    if (handlers.hasOwnProperty(action.type)) {
      return handlers[action.type](state, action);
    } else {
      return state;
    }
  }
};

// private convenience function
const _updateRequest = (value, namespace, state) => ({
  ...state,
  requests: {
    ...state.requests,
    [`${namespace}_PENDING`]: value,
  }
});

// Generator for creating default reducer action types with updating of default request keys
export const defaultReducer = ({namespace, types, reducers}) => reducer({
  [types.BEGIN]: (state, action) => {
    const newState = _updateRequest(true,namespace,state);
    return reducers.begin ? reducers.begin(newState, action) : newState;
  },
  [types.SUCCESS]: (state, action) => {
    const newState = _updateRequest(false,namespace,state);
    return reducers.success ? reducers.success(newState, action) : newState;
  },
  [types.FAILURE]: (state, action) => {
    const newState = _updateRequest(false,namespace,state);
    return reducers.failure ? reducers.failure(newState, action) : newState;
  },
});
