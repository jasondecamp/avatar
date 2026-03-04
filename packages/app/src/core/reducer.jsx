import { merge } from 'lodash';
import { generate } from '@avatar/library';

import * as builder from '../features/builder/reducers';

const initialState = merge(
  { requests: {} },
  builder.initialState,
);

const reducers = [
  ...builder.reducers,
];

export const reducer = generate.rootReducer(initialState, reducers);
