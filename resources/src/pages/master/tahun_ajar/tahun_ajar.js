import React, {useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import {HiOutlinePencilAlt , HiOutlineTrash, HiOutlinePlusCircle} from 'react-icons/hi';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { Formik, Field } from 'formik';
import { getAll, setActive, create, destroy, detail, updates } from '../../../api/api_tahunajar'
import swal from 'sweetalert';

import LayoutAdmin from '../../../layouts/admin';
import Tables from '../../../components/table/table';
import { getIdSekolah } from '../../../auth/auth';



const TahunAjarIndex = () => {

    let [data, setData] = useState([]);
    let [form, setForm] = useState(
        {
            id: '',
            nama: '',
            semester: '',
            id_sekolah: getIdSekolah() 
        }
    );
    let [edit, setEdit] = useState(false);
    
    let formValue = {
        id: '',
        nama: ''
    }

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => {
        formValue = {
            id: '',
            nama: '',
            semester: '',
            id_sekolah: getIdSekolah() 
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
                nama: res.data.data.tahun_ajaran,
                id_sekolah: getIdSekolah() 
            }

            setEdit(true);
            setForm(formValue);
            setShow(true);
        }else{
            swal("Error", res.message, "warning");
        }

    }

    const setAktif = async (id) => {
        console.log(id)
        let res = await setActive(id);

        if(res.status == 200){
            getData();
            swal("Good job!", "Sukses", "success");
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
                    //<span key={row.id} className="badge text-bg-success">Aktif</span>
                    <div key={cell} class="form-check form-switch" onChange={()=>setAktif(row.id)}>
                        <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked" checked/>
                        <label class="form-check-label" for="flexSwitchCheckChecked">Aktif</label>
                    </div>
                  )
                  break;
                default:
                    return (
                    //<span key={cell} className="badge text-bg-danger">Tidak aktif</span>
                    <div key={cell} class="form-check form-switch" onChange={()=>setAktif(row.id)}>
                        <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked"/>
                        <label class="form-check-label" for="flexSwitchCheckChecked">Tidak Aktif</label>
                    </div>
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
            dataField: 'tahun_ajaran',
            text: 'Nama',
            sort: true
        },
        {
            dataField: 'semester',
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
                <h1>Tahun Ajar</h1>
                <div className="section-header-breadcrumb">
                    <div className="breadcrumb-item active">
                        <Link to="/">Dashboard</Link>
                    </div>
                    <div className="breadcrumb-item">Tahun Ajar</div>
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
                                        <td width={`50%`}>{result.tahun_ajaran}</td>
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
                <Modal.Title>Tambah Tahun Ajar</Modal.Title>
            </Modal.Header>
            <Modal.Body>

                <Formik
                initialValues={form}
                onSubmit={ async (values, { setSubmitting }) => {

                    console.log(values);

                    let new_values = {
                        ...values,
                        id_sekolah: getIdSekolah(),
                        nama: `${values.nama}${values.semester}`
                    }


                    let res = edit ? await updates(new_values) : await create(new_values);
                    
                    
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
                        <label htmlFor="role">Tahun Ajaran</label>
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
                        <label htmlFor="role">Semester</label>
                        <Field name="semester" as="select" id="semester" className="form-select">
                            <option value="">-- Pilih --</option>
                            <option value="1">Ganjil</option>
                            <option value="2">Genap</option>
                        </Field>
                        {errors.semester && touched.semester && errors.semester}
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

export default TahunAjarIndex