import React, { useState } from 'react'
import { useTable , useFilters, usePagination, useSortBy, useGlobalFilter} from "react-table";

export default function TableBasic({datas ,column, columnFormats}) {

    let columnFormat = columnFormats;
    
    const columns = React.useMemo(
        () => column,
        [column]
    );

    let data = datas;

    const {
        getTableProps, // table props from react-table
        getTableBodyProps, // table body props from react-table
        headerGroups, // headerGroups, if your table has groupings
        prepareRow, // Prepare the row (this function needs to be called for each row before getting the row props)
        page,
        state: { pageIndex, pageSize, globalFilter },
        setGlobalFilter,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        
    } = useTable(
        {
            columns,
            data,
            initialState: { pageIndex: 0 },
        },
        //useFilters,
        useGlobalFilter,
        useSortBy,
        usePagination
    );

    
    return (
        <div className="table-responsive">
            <table {...getTableProps()} className="table table-striped table-md">
            <thead className="p-3 thead-light">
                {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map(column => (
                    <th {...column.getHeaderProps(column.getSortByToggleProps())}>{
                        column.render("Header")}
                        {/* Add a sort direction indicator */}
                        <span>
                            {column.isSorted
                            ? column.isSortedDesc
                                ? ' 🔽'
                                : ' 🔼'
                            : ''}
                        </span>
                    </th>
                    ))}
                </tr>
                ))}
            </thead>
            <tbody {...getTableBodyProps()}>
                {
                page.length > 0 && 
                page.map((row, i) => {
                prepareRow(row);
                return (
                    <tr {...row.getRowProps()}>
                    {row.cells.map(cell => {
                        return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
                    })}
                    </tr>
                );
                }) || <tr><td className="text-center" colSpan={100}>Tidak ada data</td></tr>
                }
            </tbody>
            </table>

        </div>
    );
}