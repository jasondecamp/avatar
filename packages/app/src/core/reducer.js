import { merge } from 'lodash';
import { generate } from '@avatar/library';

import * as home from '../features/home/reducers';
import * as builder from '../features/builder/reducers';

const initialState = merge(
  { requests: {} },
  home.initialState,
  builder.initialState,
);

const reducers = [
  ...home.reducers,
  ...builder.reducers,
];

export const reducer = generate.rootReducer(initialState, reducers);
