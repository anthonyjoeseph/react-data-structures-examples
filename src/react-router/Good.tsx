import React, { useState } from 'react';
import * as R from 'fp-ts-routing';
import { routingFromMatches } from 'fp-ts-routing-adt';
import LocationLink from './LocationLink';
import { makeMatch } from 'ts-adt/MakeADT'
import { pipe } from 'fp-ts/function'

export const {
  parse,
  format,
} = routingFromMatches(
  ['Home', R.end],
  ['About', R.lit('about').then(R.end)],
  ['Topics', R.lit('topics').then(R.end)],
  ['TopicsID', R.lit('topics').then(R.str('id')).then(R.end)],
);
export type ParseableLocation = ReturnType<typeof parse>

export type Location = Exclude<ParseableLocation, { type: 'NotFound' }>

export type TopicLocation = Extract<ParseableLocation, { type: 'Topics' | 'TopicsID' }>

export default function App() {
  const [location, setLocation] = useState<ParseableLocation>(parse(window.location.pathname));
  const updateLocation = (newLocation: Location) => {
    setLocation(newLocation);
    window.history.pushState(null, '', format(newLocation));
  }
  window.addEventListener('popstate', () => {
    setLocation(parse(window.location.pathname));
  });
  return (
    <div>
      <ul>
        <li>
          <LocationLink
            to={{ type: 'Home' }}
            updateLocation={updateLocation}
          >
            Home
          </LocationLink>
        </li>
        <li>
          <LocationLink
            to={{ type: 'About' }}
            updateLocation={updateLocation}
          >
            About
          </LocationLink>
        </li>
        <li>
          <LocationLink
            to={{ type: 'Topics' }}
            updateLocation={updateLocation}
          >
            Topics
          </LocationLink>
        </li>
      </ul>
      {pipe(
        location,
        makeMatch('type')({
          Home: () => <Home />,
          About: () => <About />,
          Topics: (l) => <Topics
            location={l}
            updateLocation={updateLocation}
          />,
          TopicsID: (l) => <Topics
            location={l}
            updateLocation={updateLocation}
          />,
          NotFound: () => <div />,
        })
      )}
    </div>
  );
}

function Home() {
  return <h2>Home</h2>;
}

function About() {
  return <h2>About</h2>;
}

const Topics = ({
  location,
  updateLocation,
}: {
  location: TopicLocation,
  updateLocation: (l: Location) => void,
}) => (
  <div>
    <h2>Topics</h2>
    <ul>
      <li>
        <LocationLink
          to={{ type: 'TopicsID', id: 'components' }}
          updateLocation={updateLocation}
        >
          Components
        </LocationLink>
      </li>
      <li>
        <LocationLink
          to={{ type: 'TopicsID', id: 'props-v-state' }}
          updateLocation={updateLocation}
        >
          Props v. State
        </LocationLink>
      </li>
    </ul>
    {pipe(
      location,
      makeMatch('type')({
        Topics: () => <h3>Please select a topic.</h3>,
        TopicsID: (l) => <Topic topicId={l.id} />
      })
    )}
  </div>
);

function Topic({
  topicId,
}: {
  topicId: string
}) {
  return <h3>Requested topic ID: {topicId}</h3>;
}
