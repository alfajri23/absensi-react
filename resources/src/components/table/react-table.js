import React, { useState } from 'react'
import { useTable , useFilters, usePagination, useSortBy, useGlobalFilter} from "react-table";
import {useExportData} from 'react-table-plugins'
import { GlobalFilter } from './GlobalFilter';
import Radium, { StyleRoot } from 'radium';
// import Papa from "papaparse";


export default function Table({datas ,column, columnFormats}) {

    let columnFormat = columnFormats;
    
    const columns = React.useMemo(
        () => column,
        [column]
    );

    // function getExportFileBlob({ columns, data, fileType, fileName }) {
    //     if (fileType === "csv") {
    //       // CSV example
    //       const headerNames = columns.map((col) => col.exportValue);
    //       const csvString = Papa.unparse({ fields: headerNames, data });
    //       return new Blob([csvString], { type: "text/csv" });
    //     }
    // }

    const notPrint = {
        '@media print' : {
            display: 'none',
        },
    };

    const style = {
        marginTop: `20px`,
        '@media (min-width: 500px)': {
            marginTop: `-60px`,
        },
        '@media print' : {
            marginTop: `40px`,
        },
    };

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
        exportData
    } = useTable(
        {
            columns,
            data,
            initialState: { pageIndex: 0 },
            //getExportFileBlob
        },
        //useFilters,
        useGlobalFilter,
        useSortBy,
        usePagination,
        useExportData,
    );

    
    return (
        <StyleRoot>
        <div style={style}>
             <div className="row d-flex flex-row-reverse">

                {/* <div className="form-group col-2 col-sm-2">
                    <label className="form-label">&nbsp;</label><br></br>
                    <button
                        className="btn btn-sm btn-danger"
                        onClick={() => {
                        exportData("csv", true);
                        }}
                    >download</button>
                </div> */}

                <div style={notPrint} className="form-group col-10 col-sm-4">
                    <label >Search</label>
                    <input
                    className="form-control"
                        type="text"
                        value={globalFilter || ""}
                        onChange={e => setGlobalFilter(e.target.value)}
                    />
                </div>
            </div>

            <div className="table-responsive">
                <table {...getTableProps()} className="table table-striped table-md">
                <thead className="thead-dark p-3">
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

            <div style={notPrint} className="row justify-content-between">
                <div className="col-4">
                <nav aria-label="Page navigation example">
                    <ul className="pagination">
                        <li className="page-item">
                            <a className="page-link" onClick={() => gotoPage(0)} disabled={!canPreviousPage} aria-label="Previous">
                                <span aria-hidden="true">&laquo;</span>
                                <span aria-hidden="true">&laquo;</span>
                            </a>
                        </li>
                        <li className="page-item">
                            <a className="page-link" onClick={() => previousPage()} disabled={!canPreviousPage} aria-label="Previous">
                                <span aria-hidden="true">&laquo;</span>
                            </a>
                        </li>
                        <li className="page-item">
                            <a className="page-link" onClick={() => nextPage()} disabled={!canNextPage} aria-label="Next">
                                <span aria-hidden="true">&raquo;</span>
                            </a>
                        </li>
                        <li className="page-item">
                            <a className="page-link"onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage} aria-label="Next">
                                <span aria-hidden="true">&raquo;</span>
                                <span aria-hidden="true">&raquo;</span>
                            </a>
                        </li>
                    </ul>
                </nav>
                </div>

                <div className="col-4">
                    Page{' '}
                    <strong>
                        {pageIndex + 1} of {pageOptions.length}
                    </strong>{' '}
                </div>

                <div className="col-auto">
                <select
                    className="custom-select"
                    value={pageSize}
                    onChange={e => {
                        setPageSize(Number(e.target.value))
                    }}
                    >
                    {[5, 10, 20, 30, 40, 50].map(pageSize => (
                        <option key={pageSize} value={pageSize}>
                        Show {pageSize}
                        </option>
                    ))}
                </select>
                </div>
            </div>

            <div style={notPrint} className="pagination">
                

            </div>
        </div>
        </StyleRoot>
    );
}
