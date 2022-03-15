import React, { ReactNode } from "react";
import { format, Location, route$ } from "./Route";

type AnchorProps = React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>

export const Link = ({ to, onClick, children, ...props }: { to: Exclude<Location, { type: 'NotFound' }>; children: NonNullable<ReactNode>; } & Omit<AnchorProps, 'href'>) => {
  return (
    <a
      {...props}
      href={format(to)}
      onClick={(event) => {
        event.preventDefault();
        onClick?.(event)
        route$.next(to);
      }}
    >
      {children}
    </a>
  )
}