import React, { useState, ReactNode, useEffect } from "react";

export const withParserFormatter = <R,>({ 
  parse, 
  format 
}: { 
  parse: (r: string) => R; 
  format: (r: R) => string 
}): {
  useRoute: () => R;
  setRoute: (r: Exclude<R, { type: 'NotFound' }>) => void;
  Link: (props: { to: Exclude<R, { type: 'NotFound' }>; children: NonNullable<ReactNode>; }) => ReactNode
} => {
  let listener = (_: R) => {}
  const setRoute = (newRoute: R) => listener(newRoute)
  const listenToTrggerUpdate = (callback: (r: R) => void) => {
    listener = callback
  }
  return {
    useRoute: () => {
      const [location, setLocation] = useState<R>(parse(window.location.pathname));
      useEffect(() => {
        listenToTrggerUpdate(setLocation);
        window.addEventListener('popstate', () => setLocation(parse(window.location.pathname)));
      }, [])
      return location
    },
    setRoute,
    Link: ({ to, children }) => {
      return (
        <a
          href={format(to)}
          onClick={(event) => {
            event.preventDefault();
            setRoute(to);
          }}
        >
          {children}
        </a>
      )
    }
  }
}