import { CompactTable } from '@table-library/react-table-library/compact';
import React, {useEffect, useState} from 'react'
import { useTheme } from '@table-library/react-table-library/theme';
import { getTheme } from '@table-library/react-table-library/baseline';
import { usePagination } from '@table-library/react-table-library/pagination';


const key = 'Pagination';

const Component = ({nodes, COLUMN, width, searching}) => {

    let data = { nodes };
    let column = COLUMN;

    console.log(searching)

    const theme = useTheme([
        getTheme(),width
      ]);

    //SEARCH
    const [search, setSearch] = useState('');

    const handleSearch = (event) => {
        setSearch(event.target.value);
    };


    const cari = (item) => {
        //return item.nama.toLowerCase().includes(search.toLowerCase())
        return item.nama.toLowerCase().includes(search.toLowerCase())
    }

    console.log('eks',searching)
    console.log('int',cari)


    data = {
      nodes: data.nodes.filter(cari),
    };

    //End SEARCH

    //PAGINATION
    const pagination = usePagination(data, {
        state: {
        page: 0,
        size: 10,
        },
        onChange: onPaginationChange,
    });

    function onPaginationChange(action, state) {
        console.log(action, state);
    }

    //END PAGINATION

    return (
        <>

        <div className="row">
            <div className="col-4 form-group mb-0">
                <label htmlFor="search">
                    Search
                </label>
                <input id="search" className="form-control" type="text" value={search} onChange={handleSearch} />
            </div>
        </div>

        <br />

        <CompactTable columns={column} data={data} pagination={pagination} theme={theme} layout={{ custom: true, horizontalScroll: true}}/>

        <br />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>Total Pages: {pagination.state.getTotalPages(data.nodes)}</span>

        <span>
          Page:{' '}
          {pagination.state.getPages(data.nodes).map((_, index) => (
            <button
              key={index}
              type="button"
              style={{
                fontWeight: pagination.state.page === index ? 'bold' : 'normal',
              }}
              onClick={() => pagination.fns.onSetPage(index)}
            >
              {index + 1}
            </button>
          ))}
        </span>
      </div>

      <br />
        
        </>
        
    );
};

export default Component;