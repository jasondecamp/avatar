import { DateTime } from 'luxon';
import { get } from 'lodash';

const isFresh = (cached, expiration) => {
  if(expiration === true || !expiration) expiration = { minutes: 5 };
  return get(cached,'fetched_at') &&
    DateTime.fromMillis(get(cached,'fetched_at')).plus(expiration) > DateTime.now();
};

// Generator for creating default actionCreators with standard dispatch events
export const actionCreator = ({ types, request, selector, cache }) => (...params) => {
  return (dispatch, getState) => {
    if(cache && selector) {
      const cached = selector(getState(), ...params);
      if(cached && isFresh(cached,cache))
        return new Promise((resolve) => {
          dispatch({ type: types.SUCCESS, response: cached, params: params });
          resolve(cached);
        });
    }
    dispatch({ type: types.BEGIN });
    const promise = new Promise((resolve, reject) => {
      request(...params).then(
        (res) => {
          // add fetched_at for anything that supports it
          if(typeof res === 'object' && res !== null) res.fetched_at = new DateTime.now().toMillis();
          dispatch({ type: types.SUCCESS, response: res, params: params });
          resolve(res);
        },
        (err) => {
          dispatch({ type: types.FAILURE, response: err, params: params });
          reject(err);
        },
      );
    });
    return promise;
  };
};
