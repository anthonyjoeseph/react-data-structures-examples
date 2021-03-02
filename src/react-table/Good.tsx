import { identity, pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as A from 'fp-ts/Array'
import React from 'react';
import styled from 'styled-components';
import makeData from './lib/makeData';
import { Tree, branchGrid, leaves } from './lib/TreeUtil';

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

type ValueOf<A> = A[keyof A]

interface Group<A> {
  Header: string
  columns: Column<A>[]
}
type Accessor<A> = ValueOf<{
  [K in keyof A]: {
    Header: string
    accessor: K
    Cell?: (val: A[K]) => React.ReactNode
  }
}>
type Column<A> = Group<A> | Accessor<A>

const toTree = <A,>(col: Column<A>): Tree<Accessor<A>, string> => 'columns' in col
  ? {
    type: 'Branch',
    value: col.Header,
    children: col.columns.map(toTree)
  }
  : {
    type: 'Leaf',
    value: col
  }

const Table = <A,>({ data, columns }: { data: A[]; columns: Column<A>[] }) => {
  const accessors = pipe(columns, A.map(toTree), A.chain(leaves))
  return (
    <table>
      <thead>
        {branchGrid(columns.map(toTree)).map(headerGroup => (
          <tr>
            {headerGroup.map(({ value, numLeaves }) => (
              <th colSpan={numLeaves}>{pipe(value, O.toUndefined)}</th>
            ))}
          </tr>
        ))}
        <tr>
          {accessors.map(({Header}) => <th>{Header}</th>)}
        </tr>
      </thead>
      <tbody>
        {data.map(rowData => (
          <tr>
            {accessors.map(({Cell = identity, accessor}) => (
              <td>{Cell(rowData[accessor])}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

type User = ReturnType<typeof makeData>[number]
const App = () => {
  const columns = React.useMemo(
    (): Column<User>[] => [
      {
        Header: 'Name',
        columns: [
          { Header: 'First Name', accessor: 'firstName' },
          { Header: 'Last Name', accessor: 'lastName' },
        ],
      },
      {
        Header: 'Info',
        columns: [
          { Header: 'Age', accessor: 'age' },
          { Header: 'Visits', accessor: 'visits' },
          { Header: 'Status', accessor: 'status' },
          { Header: 'Profile Progress', accessor: 'progress' },
        ],
      },
    ],
    []
  )
  const data = React.useMemo(() => makeData(20), [])
  return (
    <Styles>
      <Table columns={columns} data={data} />
    </Styles>
  )
}

export default App