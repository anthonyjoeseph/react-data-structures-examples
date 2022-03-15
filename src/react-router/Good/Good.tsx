import React from 'react';
import { makeMatch } from 'ts-adt/MakeADT'
import { pipe } from 'fp-ts/function'
import { Location, route$ } from './Route';
import { Link } from './Link';
import { useObservableEagerState } from 'observable-hooks';

export default function App() {
  const location = useObservableEagerState(route$)
  return (
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
  location: Extract<Location, { type: 'Topics' | 'TopicsID' }>
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
