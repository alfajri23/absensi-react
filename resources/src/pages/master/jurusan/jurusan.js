import React, {useEffect, useState} from 'react'
import { getAll } from '../../../api/api_jurusan';
import { Link } from 'react-router-dom'

import 'jquery/dist/jquery.min.js';
import $ from 'jquery';
import LayoutAdmin from '../../../layouts/admin';

require("datatables.net-bs4/css/dataTables.bootstrap4.min.css");
require("datatables.net-buttons-bs4");
require("datatables.net-buttons/js/buttons.html5");
require("datatables.net-buttons/js/buttons.print");
require("datatables.net-buttons/js/buttons.colVis");

// require("datatables.net-responsive");
// require("datatables.net-responsive-bs4");
// require("datatables.net-select");
// require("datatables.net-select-bs4");

// //jQuery libraries

 
// //Datatable Modules
//import "datatables.net/js/dataTables.dataTables"
// import "datatables.net-dt/css/jquery.dataTables.min.css"



const JurusanIndex = () => {

    let [data, setData] = useState([]);

    useEffect(() => {
        getData();

        $(document).ready(function () {
            setTimeout(function(){
                $('#example').DataTable({
                    pagingType: "full_numbers",
                    pageLength: 20,
                    processing: true,
                    dom: "Bfrtip",
                    select: {
                        style: "single",
                    },
                });
            },1500);
        });

    },[]);

    const getData = async () => {
        let data = await getAll();
        setData(data.data);
        console.log(data.data);
    }

    const setStatus = (data) => {
        switch(data) {
            case 'Aktif':
              return(
                <span className="badge text-bg-success">Aktif</span>
              )
              break;
            default:
                return (<span className="badge text-bg-danger">Tidak aktif</span>)
          }
    }



    return (
        <LayoutAdmin>
        <div>
            <div className="section-header">
                <h1>Dashboard</h1>
                <div className="section-header-breadcrumb">
                    <div className="breadcrumb-item active">
                        <Link to="/">Dashboard</Link>
                    </div>
                    <div className="breadcrumb-item">Transaksi</div>
                </div>
            </div>

            <div className="container">
                <div className="card">
                    <div className="card-body">
                        <div className="container-fluid">
                            <table id="example" className="table table-hover table-bordered">
                                <thead>
                                    <tr>
                                    <th>ID</th>
                                    <th>Nama</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {data.map((result,key) => {
                                    return (
                                        <tr key={key}>
                                        <td width={`5%`}>{result.id}</td>
                                        <td width={`50%`}>{result.nama}</td>
                                        <td  width={`10%`}>
                                            {
                                                setStatus(result.status)
                                            }
                                            
                                        </td>
                                        <td width={`10%`}>
                                            <div class="btn-group" role="group" aria-label="Basic outlined example">
                                                <button type="button" class="btn btn-outline-primary">Left</button>
                                                <button type="button" class="btn btn-outline-primary">Middle</button>
                                                <button type="button" class="btn btn-outline-primary">Right</button>
                                            </div>
                                        </td>
                                        </tr>
                                    )
                                })}  
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </LayoutAdmin>
    )
}

export default JurusanIndex