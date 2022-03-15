import { BehaviorSubject, fromEvent, merge } from 'rxjs';
import { map } from 'rxjs/operators';

export const mutablePathname = () => {
  const onPopState = fromEvent(window, 'popstate').pipe(
    map(() => window.location.pathname)
  )
  const reroutes = new BehaviorSubject(window.location.pathname)
  reroutes.subscribe((newRoute) => window.history.pushState(null, '', newRoute))
  return {
    pathname$: merge(onPopState, reroutes),
    setPathname: (r: string) => reroutes.next(r),
  };
}
