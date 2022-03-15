import { pipe } from "fp-ts/function";
import { BehaviorSubject, fromEvent, merge } from 'rxjs';
import * as ro from 'rxjs/operators'

export const getRoute = <R,>({ 
  parse, 
  format 
}: { 
  parse: (r: string) => R; 
  format: (r: R) => string 
}) => {
  const internal = new BehaviorSubject<R>(parse(window.location.pathname))
  const external = pipe(
    fromEvent(window, 'popstate'),
    ro.map(() => parse(window.location.pathname))
  ) 
  pipe(
    merge(internal, external),
    ro.tap((newRoute) => window.history.pushState(null, '', format(newRoute)))
  )
  return internal;
}
