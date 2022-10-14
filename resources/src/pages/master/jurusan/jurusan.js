import React, {useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import {HiOutlinePencilAlt , HiOutlineTrash, HiOutlinePlusCircle} from 'react-icons/hi';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { Formik } from 'formik';
import { getAll, create, destroy, detail, updates } from '../../../api/api_jurusan'
import swal from 'sweetalert';

import LayoutAdmin from '../../../layouts/admin';
import Tables from '../../../components/table/table';


const JurusanIndex = () => {

    let [data, setData] = useState([]);
    let [form, setForm] = useState(
        {
            id: '',
            nama: '',
            kode: '',
        }
    );
    let [edit, setEdit] = useState(false);
    
    let formValue = {
        id: '',
        nama: '',
        kode: '',
    }

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => {
        formValue = {
            id: '',
            nama: '',
            kode: '',
        }

        setEdit(false);
        setForm(formValue);
        setShow(true);
    }

    useEffect(() => {
        getData();
    },[]);

    const getData = async () => {
        let data = await getAll();
        setData(data.data);
        console.log(data.data);
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
            console.log(res.data.data);

            formValue ={
                ...formValue,
                id : res.data.data.id,
                nama: res.data.data.nama,
                kode: res.data.data.kode,
            }

            setEdit(true);
            setForm(formValue);
            setShow(true);
        }else{
            swal("Error", res.message, "warning");
        }

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
                            <button onClick={handleShow} className="btn btn-success">
                                <HiOutlinePlusCircle className="fs-6 mr-1" /> Tambah
                            </button>

                            <Tables data={data} column={column} columnFormats={columnFormat}/>
                           
                            {/* <table id="example" className="table table-hover table-striped table-bordered">
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
                <Modal.Title>Tambah Jurusan</Modal.Title>
            </Modal.Header>
            <Modal.Body>

                <Formik
                initialValues={form}
                onSubmit={ async (values, { setSubmitting }) => {

                    let res = edit ? await create(values) : await updates(values);
                    
                    
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
                        <label htmlFor="role">Kode</label>
                        <input
                            type="kode"
                            name="kode"
                            className="form-control" 
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.kode}
                        />
                        {errors.kode && touched.kode && errors.kode}
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

export default JurusanIndex