import reduceReducers from 'reduce-reducers';

export const rootReducer = (initialState, reducers) => {
  const baseReducer = reduceReducers(initialState, ...reducers);
  return (state, action) => {
    const newState = { ...initialState, ...state };
    const reducer = reduceReducers(initialState, baseReducer);
    return reducer(newState, action);
  };
};
