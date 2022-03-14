import React from 'react';
import { groupHeaders, accessors } from 'tree-to-grid';
import { Column } from 'tree-to-grid/dist/column'
export { Column };

export const Table = <A,>({ data, columns }: { data: A[]; columns: Column<A>[] }) => {
  const allAccessors = columns.flatMap(accessors)
  return (
    <table>
      <thead>
        {groupHeaders(columns).map(headerGroup => (
          <tr>
            {headerGroup.map(({ Header, numLeaves }) => (
              <th colSpan={numLeaves}>{Header}</th>
            ))}
          </tr>
        ))}
        <tr>
          {allAccessors.map((a) => <th>{a.Header}</th>)}
        </tr>
      </thead>
      <tbody>
        {data.map(rowData => (
          <tr>
            {allAccessors.map(({ accessor }) => (
              <td>{rowData[accessor]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
