import React from "react";
import { format, Route, setRoute } from "./Route";

type AnchorProps = React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>

export const Link = (
  { to, onClick, children, ...props }: 
  { 
    to: Exclude<Route, { type: 'NotFound' }>;
  } & Omit<AnchorProps, 'href'>
) => (
  <a
    {...props}
    href={format(to)}
    onClick={(event) => {
      event.preventDefault();
      onClick?.(event)
      setRoute(to);
    }}
  >
    {children}
  </a>
)