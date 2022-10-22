import React, { useState } from 'react'
import { useTable , useFilters, usePagination, useSortBy, useGlobalFilter} from "react-table";
import { GlobalFilter } from './GlobalFilter';


export default function Table({datas ,column, columnFormats}) {

    const getData = () => [
        {
          name: "Jane Cooper",
          email: "jane.cooper@example.com",
          title: "Regional Paradigm Technician",
          department: "Optimization",
          status: "Active",
          role: "Admin",
          imgUrl:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
        },
        {
          name: "Cody Fisher",
          email: "cody.fisher@example.com",
          title: "Product Directives Officer",
          department: "Intranet",
          status: "Active",
          role: "Owner",
          imgUrl:
            "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
        },
        {
          name: "Esther Howard",
          email: "esther.howard@example.com",
          title: "Forward Response Developer",
          department: "Directives",
          status: "Active",
          role: "Member",
          imgUrl:
            "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
        },
        {
          name: "Jenny Wilson",
          email: "jenny.wilson@example.com",
          title: "Central Security Manager",
          department: "Program",
          status: "Active",
          role: "Member",
          imgUrl:
            "https://images.unsplash.com/photo-1498551172505-8ee7ad69f235?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
        },
        {
          name: "Kristin Watson",
          email: "kristin.watson@example.com",
          title: "Lean Implementation Liaison",
          department: "Mobility",
          status: "Active",
          role: "Admin",
          imgUrl:
            "https://images.unsplash.com/photo-1532417344469-368f9ae6d187?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
        },
        {
          name: "Cameron Williamson",
          email: "cameron.williamson@example.com",
          title: "Internal Applications Engineer",
          department: "Security",
          status: "Active",
          role: "Member",
          imgUrl:
            "https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
        },
        {
            name: "Jane Cooper",
            email: "jane.cooper@example.com",
            title: "Regional Paradigm Technician",
            department: "Optimization",
            status: "Active",
            role: "Admin",
            imgUrl:
              "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
        },
        {
            name: "Cody Fisher",
            email: "cody.fisher@example.com",
            title: "Product Directives Officer",
            department: "Intranet",
            status: "Active",
            role: "Owner",
            imgUrl:
              "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
        },
        {
            name: "Esther Howard",
            email: "esther.howard@example.com",
            title: "Forward Response Developer",
            department: "Directives",
            status: "Active",
            role: "Member",
            imgUrl:
              "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
        },
        {
            name: "Jenny Wilson",
            email: "jenny.wilson@example.com",
            title: "Central Security Manager",
            department: "Program",
            status: "Active",
            role: "Member",
            imgUrl:
              "https://images.unsplash.com/photo-1498551172505-8ee7ad69f235?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
        },
        {
            name: "Kristin Watson",
            email: "kristin.watson@example.com",
            title: "Lean Implementation Liaison",
            department: "Mobility",
            status: "Active",
            role: "Admin",
            imgUrl:
              "https://images.unsplash.com/photo-1532417344469-368f9ae6d187?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
        },
        {
            name: "Cameron Williamson",
            email: "cameron.williamson@example.com",
            title: "Internal Applications Engineer",
            department: "Security",
            status: "Active",
            role: "Member",
            imgUrl:
              "https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
        },
    ];

    let datat = [
        {
            name: "Jane Cooper",
            email: "jane.cooper@example.com",
            title: "Regional Paradigm Technician",
            department: "Optimization",
            status: "Active",
            role: "Admin",
            imgUrl:
              "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
          },
          {
            name: "Cody Fisher",
            email: "cody.fisher@example.com",
            title: "Product Directives Officer",
            department: "Intranet",
            status: "Active",
            role: "Owner",
            imgUrl:
              "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
          },
          {
            name: "Esther Howard",
            email: "esther.howard@example.com",
            title: "Forward Response Developer",
            department: "Directives",
            status: "Active",
            role: "Member",
            imgUrl:
              "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
          },
    ];

    let columnFormat = columnFormats;
    
    const columns = React.useMemo(
        () => column,
        [column]
    );

    //const data = datas;
    //const data = React.useMemo(() => datas, []);

    let data = datas;

    // console.log('data lempar',datas);
    // console.log('data lokal',datat);
    // console.log(column);

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
        <div style={{ marginTop: `-40px`}}>

             <div className="row d-flex flex-row-reverse">
                <div className="form-group col-4">
                    <label >Search</label>
                    <input
                    className="form-control"
                        type="text"
                        value={globalFilter || ""}
                        onChange={e => setGlobalFilter(e.target.value)}
                    />
                </div>
            </div>
            


            <table {...getTableProps()} className="table table-striped table-sm">
            <thead className="text-white bg-primary p-3">
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
                {page.map((row, i) => {
                prepareRow(row);
                return (
                    <tr {...row.getRowProps()}>
                    {row.cells.map(cell => {
                        return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
                    })}
                    </tr>
                );
                })}
            </tbody>
            </table>

            <div className="row justify-content-between">
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

            <div className="pagination">
                

            </div>
        </div>
    );
}