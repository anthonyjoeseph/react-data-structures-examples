import React, { useState } from 'react';
import Link from './Link';
import { makeMatch } from 'ts-adt/MakeADT'
import { pipe } from 'fp-ts/function'
import { format, parse, ParseableLocation, UpdateLocationContext } from './Route';


export default function App() {
  const [location, setLocation] = useState<ParseableLocation>(parse(window.location.pathname));
  window.addEventListener('popstate', () => setLocation(parse(window.location.pathname)));
  return (
    <UpdateLocationContext.Provider value={(newLocation) => {
      setLocation(newLocation);
      window.history.pushState(null, '', format(newLocation));
    }}>
      <div>
        <ul>
          <li>
            <Link to={{ type: 'Home' }}>
              Home
            </Link>
          </li>
          <li>
            <Link to={{ type: 'About' }}>
              About
            </Link>
          </li>
          <li>
            <Link to={{ type: 'Topics' }}>
              Topics
            </Link>
          </li>
        </ul>
        {pipe(
          location,
          makeMatch('type')({
            Home: () => <Home />,
            About: () => <About />,
            Topics: (l) => <Topics location={l} />,
            TopicsID: (l) => <Topics location={l} />,
            NotFound: () => <div />,
          })
        )}
      </div>
    </UpdateLocationContext.Provider>
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
}: {
  location: Extract<ParseableLocation, { type: 'Topics' | 'TopicsID' }>
}) => (
  <div>
    <h2>Topics</h2>
    <ul>
      <li>
        <Link to={{ type: 'TopicsID', id: 'components' }}>
          Components
        </Link>
      </li>
      <li>
        <Link to={{ type: 'TopicsID', id: 'props-v-state' }}>
          Props v. State
        </Link>
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
