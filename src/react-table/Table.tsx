import React from 'react'
import styled from 'styled-components'
import makeData from './lib/makeData'
import Table, { Column } from './Good'

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
type User = ReturnType<typeof makeData>[number]
const App = () => {
  const columns = React.useMemo(
    (): Column<User>[] => [
      {
        Header: 'Name',
        columns: [
          {
            Header: 'First Name Overlord', 
            columns: [
              {
                Header: 'Other overlord',
                columns: [
                  { Header: 'First Name', accessor: 'firstName' }
                ]
              }
            ] 
          },
          {
            Header: 'Status Overlord', 
            columns: [
              { Header: 'Status', accessor: 'status' },
            ] 
          },
          {
            Header: "Age overlord",
            columns: [
              { Header: 'Age', accessor: 'age' },
            ]
          },
          { Header: 'Last Name', accessor: 'lastName' },
          {
            Header: 'Visits Overlord', 
            columns: [
              {
                Header: 'Other Overlord 2',
                columns: [
                  { Header: 'Visits', accessor: 'visits' },
                ]
              }
            ] 
          },
        ],
      },
      {
        Header: 'Info',
        columns: [
          
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