import BootstrapTable from 'react-bootstrap-table-next';
import React from 'react'
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, {Search} from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';


const { SearchBar, ClearSearchButton } = Search;

const Tables = ({data ,column, columnFormats}) => {

  let columnFormat = columnFormats;

  
  return(
    <div style={{ marginTop: `-40px`}}>
      <ToolkitProvider
        keyField="email"
        data={ data }
        columns={ column }
        search
      >
        {
          props => (
            <div>
              <div className="row-reverse clearfix">
                <div className="col-4 float-end">
                  <SearchBar { ...props.searchProps } />
                  <ClearSearchButton { ...props.searchProps } />
                </div>
              </div>
              

              <hr />
              <BootstrapTable pagination={ paginationFactory() }
                { ...props.baseProps }
              />
            </div>
          )
        }
      </ToolkitProvider>
    </div>
  )
}

export default Tables;