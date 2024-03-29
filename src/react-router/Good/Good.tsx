import React from 'react';
import { makeMatchI, makeMatchPI } from 'ts-adt/MakeADT'
import { Route, route$ } from './Route';
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
      {makeMatchPI('type')(location)(
        {
          Home: () => <Home />,
          About: () => <About />,
          NotFound: () => <div />,
        }, 
        (l) => <Topics location={l} />
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
  location: Extract<Route, { type: 'Topics' | 'TopicsID' }>
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
    {makeMatchI('type')(location)({
      Topics: () => <h3>Please select a topic.</h3>,
      TopicsID: (l) => <Topic topicId={l.id} />
    })}
  </div>
);

function Topic({
  topicId,
}: {
  topicId: string
}) {
  return <h3>Requested topic ID: {topicId}</h3>;
}
