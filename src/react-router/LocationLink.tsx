import React from 'react';
import Link from './Link';
import { Location, format } from './Good';

const LocationLink = ({
  to,
  updateLocation,
  children,
}: {
  to: Location;
  updateLocation: (location: Location) => void;
  children: string;
}) => <Link
  to={format(to)}
  updatePathname={() => updateLocation(to)}
  children={children}
/>;

export default LocationLink;