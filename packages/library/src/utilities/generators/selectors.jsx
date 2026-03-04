import { useSelector } from 'react-redux';
import { get } from 'lodash';

const createSelector = (selector) => (...params) => useSelector(state => selector(state, ...params));
const createPendingSelector = (namespace) => () => useSelector(state => get(state,`requests.${namespace}_PENDING`));

export { createSelector, createPendingSelector };
