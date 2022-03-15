import { BehaviorSubject, fromEvent, merge } from 'rxjs';
import { map, tap } from 'rxjs/operators'

export const mutablePathname = () => {
  const reroutes = new BehaviorSubject<string>(window.location.pathname)
  const windowBack = fromEvent(window, 'popstate').pipe(
    map(() => window.location.pathname)
  )
  return {
    pathname$: merge(
      windowBack,
      reroutes.pipe(
        tap((newRoute) => window.history.pushState(null, '', newRoute))
      )
    ),
    setPathname: (r: string) => reroutes.next(r)
  };
}
