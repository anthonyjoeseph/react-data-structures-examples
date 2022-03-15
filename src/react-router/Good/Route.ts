import * as R from 'fp-ts-routing';
import { routingFromMatches } from 'fp-ts-routing-adt';
import { mutablePathname } from './pathname-observable';
import { pipe, flow } from 'fp-ts/function'
import * as ro from 'rxjs/operators'

export const { format, parse } = routingFromMatches(
  ['Home', R.end],
  ['About', R.lit('about').then(R.end)],
  ['Topics', R.lit('topics').then(R.end)],
  ['TopicsID', R.lit('topics').then(R.str('id')).then(R.end)],
)

const { pathname$, setPathname } = mutablePathname()

export const route$ = pipe(pathname$, ro.map(parse))
export const setRoute = flow(format, setPathname)

export type ParseableRoute = ReturnType<typeof parse>
export type Route = Exclude<ParseableRoute, { type: "NotFound" }>

