import React, { useContext } from 'react';
import { Location, format, UpdateLocationContext } from './Route';

const Link = ({
  to,
  children,
}: {
  to: Location;
  children: string;
}) => {
  const updateLocation = useContext(UpdateLocationContext)
  return (
    <a
      href={format(to)}
      onClick={(event) => {
        event.preventDefault();
        updateLocation(to);
      }}
    >
      {children}
    </a>
  )
};

export default Link;