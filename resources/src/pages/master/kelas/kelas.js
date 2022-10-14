import React, {useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import {HiOutlinePencilAlt , HiOutlineTrash, HiOutlinePlusCircle} from 'react-icons/hi';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { Formik } from 'formik';
import { getAll, create, destroy, detail, updates } from '../../../api/api_kelas'
import { getAll as getAllJurusan } from '../../../api/api_jurusan'
import swal from 'sweetalert';


import 'jquery/dist/jquery.min.js';
import $ from 'jquery';
import LayoutAdmin from '../../../layouts/admin';
import Tables from '../../../components/table/table';

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



const KelasIndex = () => {

    let [data, setData] = useState([]);
    let [form, setForm] = useState(
        {
            id: '',
            nama: '',
            id_jurusan: '',
        }
    );
    let [jurusan, setJurusan] = useState([]);
    let [edit, setEdit] = useState(false);
    
    let formValue = {
        id: '',
        nama: '',
        id_jurusan: '',
    }

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => {
        formValue = {
            id: '',
            nama: '',
            id_jurusan: '',
        }

        getDataJurusan();
        setEdit(false);
        setForm(formValue);
        setShow(true);
    }

    

    useEffect(() => {
        getData();

        // $(document).ready(function () {
        //     setTimeout(function(){
        //         let table = $('#example').DataTable({
        //             pagingType: "full_numbers",
        //             pageLength: 20,
        //             processing: true,
        //             dom: "<'row'<'col-sm-8'><'col-sm-3'f>>" + 
        //             "<'row'<'col-sm-12'tr>>" +
        //             "<'row'<'col-sm-4'l><'col-sm-4'i><'col-sm-4'p>>",
        //             select: {
        //                 style: "single",
        //             },
        //         });
        //     },1500);
        // });

    },[]);

    const getData = async () => {
        let data = await getAll();
        setData(data.data);
    }

    const deleteData = async (id) => {
        let res = await destroy(id);

        if(res.status == 200){
            getData();
            swal("Good job!", "Sukses", "success");
        }else{
            swal("Error", res.message, "warning");
        }
    }

    const detailData = async (id) => {
        let res = await detail(id);

        if(res.status == 200){
            formValue ={
                ...formValue,
                id : res.data.data.id,
                nama: res.data.data.nama,
                id_jurusan: res.data.data.id_jurusan,
            }

            setEdit(true);
            setShow(true);
            getDataJurusan();
            setForm(formValue);
        }else{
            swal("Error", res.message, "warning");
        }

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

    const getDataJurusan = async () => {
        let data = await getAllJurusan();
        setJurusan(data.data);
    }

    const columnFormat = {
        action: (cell, row) => {
            return(
                <div key={cell} className="btn-group" role="group" aria-label="Basic outlined example">
                    <button onClick={()=> detailData(cell)} type="button" className="btn btn-sm btn-outline-primary">
                        <HiOutlinePencilAlt className="fs-6" />
                    </button>
                    <button onClick={()=> deleteData(cell)} type="button" className="btn btn-sm btn-outline-danger">
                        <HiOutlineTrash className="fs-6" />
                    </button>
                </div>
            )
        },
        status: (cell, row) => {
            switch(cell) {
                case 'Aktif':
                  return(
                    <span key={row.id} className="badge text-bg-success">Aktif</span>
                  )
                  break;
                default:
                    return (
                    <span key={row.id} className="badge text-bg-danger">Tidak aktif</span>
                )
            }
        }
    }

    const column = [
        {
            dataField: 'id',
            text: 'Id',
            sort: true
        },
        {
            dataField: 'nama',
            text: 'Nama',
            sort: true
        },
        {
            dataField: 'jurusan',
            text: 'Jurusan',
            sort: true
        },
        {
            dataField: 'status',
            text: 'Status',
            sort: true,
            formatter: columnFormat.status
        },
        {
            dataField: 'id',
            text: 'Action',
            sort: true,
            formatter: columnFormat.action
        },
    ]


    return (
        <LayoutAdmin>
        <div>
            <div className="section-header">
                <h1>Kelas</h1>
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
                            <button onClick={handleShow} className="btn btn-success">
                                <HiOutlinePlusCircle className="fs-6 mr-1" /> Tambah
                            </button>

                            <Tables data={data} column={column} columnFormats={columnFormat}/>

                           
                            {/* <table id="example" className="table table-hover table-bordered">
                                <thead>
                                    <tr>
                                    <th>ID</th>
                                    <th>Kelas</th>
                                    <th>Jurusan</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {data.map((result,key) => {
                                    return (
                                        <tr key={key}>
                                        <td width={`5%`}>{result.id}</td>
                                        <td width={`5%`}>{result.nama}</td>
                                        <td width={`40%`}>{result.jurusan}</td>
                                        <td  width={`10%`}>
                                            {
                                                setStatus(result.status)
                                            }
                                            
                                        </td>
                                        <td width={`10%`}>
                                            <div className="btn-group" role="group" aria-label="Basic outlined example">
                                                <button onClick={()=> detailData(result.id)} type="button" className="btn btn-sm btn-outline-primary">
                                                    <HiOutlinePencilAlt className="fs-6" />
                                                </button>
                                                <button onClick={()=> deleteData(result.id)} type="button" className="btn btn-sm btn-outline-danger">
                                                    <HiOutlineTrash className="fs-6" />
                                                </button>
                                            </div>
                                        </td>
                                        </tr>
                                    )
                                })}  
                                </tbody>
                            </table> */}

                        </div>
                    </div>
                </div>
            </div>
        </div>

        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Tambah Kelas</Modal.Title>
            </Modal.Header>
            <Modal.Body>

                <Formik
                initialValues={form}
                onSubmit={ async (values, { setSubmitting }) => {
                    
                    let res = edit ? await create(values) : await create(values);
                    
                    
                    if(res.status == 200){
                        getData();
                        swal("Good job!", "Sukses", "success");
                    }else{
                        swal("Error", res.message, "warning");
                    }

                    setShow(false)

                }}
                >
                {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    isSubmitting,
                    /* and other goodies */
                }) => (
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="role">Nama</label>
                        <input
                            type="nama"
                            name="nama"
                            className="form-control" 
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.nama}
                        />
                        {errors.nama && touched.nama && errors.nama}
                    </div>

                    <div className="form-group">
                        <label htmlFor="role">Jurusan</label>
                        <select className="form-control" onChange={handleChange}
                            onBlur={handleBlur} name="id_jurusan" value={values.id_jurusan}>
                            <option value=''>Pilih</option>
                            { jurusan.map((result,key) => {
                                return (  
                                    <option key={key} value={result.id}>{result.nama}</option>
                                    )
                            })}   
                        </select>
                        
                        {/* <input
                            type="id_jurusan"
                            name="id_jurusan"
                            className="form-control" 
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.id_jurusan}
                        /> */}
                        {errors.id_jurusan && touched.id_jurusan && errors.id_jurusan}
                    </div>

                    <button type="submit" className="btn btn-nu btn-lg btn-block" disabled={isSubmitting}>
                        Submit
                    </button>
                </form>
                )}
                </Formik>

            </Modal.Body>

        </Modal>
        </LayoutAdmin>
    )
}

export default KelasIndex