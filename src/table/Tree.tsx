import { identity, pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as R from 'fp-ts/Record';
import * as S from 'fp-ts/Semigroup';
import * as T from 'fp-ts/Tree';
import React from 'react';
import styled from 'styled-components';
import makeData from './lib/makeData';
import { forestGridByLevel, forestLeaves } from './lib/TreeUtil';

const Styles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    border: 1px solid black;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }
    }
  }
`

type Column<A> = {
  Header: string
  columns: Column<A>[]
} | {
  accessor: A
}

const toTree = <A,>(col: Column<A>): T.Tree<A | string> => 'columns' in col
  ? T.make(col.Header, col.columns.map(toTree))
  : T.of(col.accessor)

const Table = <A, Key extends keyof A = NonNullable<keyof A>>({
  data, columns, headers, cells
}: {
  data: A[]
  columns: Column<Key>[]
  headers: Record<Key, string>
  cells: {
    [K in Key]: (val: A[K]) => React.ReactNode
  }
}) => {
  const accessors: Key[] = forestLeaves(columns.map(toTree))
    .map((accessor: string | Key) => accessor as Key)
  return (
    <Styles>
      <table>
        <thead>
          {forestGridByLevel(columns.map(toTree)).map(headerGroup => (
            <tr>
              {headerGroup.map(({ value, numLeaves }) => (
                <th colSpan={numLeaves}>{pipe(value, O.toUndefined)}</th>
              ))}
            </tr>
          ))}
          <tr>
            {accessors.map(accessor => <th>{headers[accessor]}</th>)}
          </tr>
        </thead>
        <tbody>
          {data.map(rowData => (
            <tr>
              {accessors.map(accessor => <td>{cells[accessor](rowData[accessor])}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </Styles>
  )
}

type User = ReturnType<typeof makeData>[number]
const App = () => {
  const columns = React.useMemo(
    (): Column<keyof User>[] => [
      {
        Header: 'Name',
        columns: [
          { accessor: 'firstName' },
          { accessor: 'lastName' },
        ],
      },
      {
        Header: 'Info',
        columns: [
          { accessor: 'age' },
          { accessor: 'visits' },
          { accessor: 'status' },
          { accessor: 'progress' },
        ],
      },
    ],
    []
  )
  const data: User[] = React.useMemo(() => makeData(20), [])
  const headers: Record<keyof User, string> = {
    firstName: 'First Name',
    lastName: 'Last Name',
    age: 'Age',
    progress: 'Profile Progress',
    status: 'Status',
    visits: 'Visits',
  }
  return (
    <Table
      data={data}
      columns={columns}
      headers={headers}
      cells={
        R.fromFoldableMap(S.getLastSemigroup<(s: string | number) => React.ReactNode>(), RA.readonlyArray)(
          Object.keys(headers) as (keyof User)[],
          (key) => [key, identity],
        )
      }
    />
  )
}

export default App