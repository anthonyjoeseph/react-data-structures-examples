import * as R from 'fp-ts-routing';
import { routingFromMatches } from 'fp-ts-routing-adt';
import { getRoute } from './fp-ts-routing-react';


export const { format, parse } = routingFromMatches(
  ['Home', R.end],
  ['About', R.lit('about').then(R.end)],
  ['Topics', R.lit('topics').then(R.end)],
  ['TopicsID', R.lit('topics').then(R.str('id')).then(R.end)],
)

export const route$ = getRoute({ format, parse })

export type ParseableLocation = ReturnType<typeof parse>
export type Location = Exclude<ParseableLocation, { type: "NotFound" }>

