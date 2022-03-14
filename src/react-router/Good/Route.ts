import { createContext } from 'react';
import * as R from 'fp-ts-routing';
import { routingFromMatches } from 'fp-ts-routing-adt';

export const {
  parse,
  format,
} = routingFromMatches(
  ['Home', R.end],
  ['About', R.lit('about').then(R.end)],
  ['Topics', R.lit('topics').then(R.end)],
  ['TopicsID', R.lit('topics').then(R.str('id')).then(R.end)],
);
export type ParseableLocation = ReturnType<typeof parse>

export type Location = Exclude<ParseableLocation, { type: 'NotFound' }>

export const UpdateLocationContext = createContext<(l: Location) => void>(() => {}) 

