import React, {useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import {HiOutlinePencilAlt , HiOutlineTrash, HiOutlinePlusCircle} from 'react-icons/hi';
import { AiOutlineCloudSync } from 'react-icons/ai';
import Modal from 'react-bootstrap/Modal';
import { Formik } from 'formik';
import { getAll, create, destroy, detail, updates, sync, statusActive } from '../../api/api_libur'
import swal from 'sweetalert';

import LayoutAdmin from '../../layouts/admin';
import Tables from '../../components/table/table';
import { getIdSekolah } from '../../auth/auth';


const LiburIndex = () => {

    let [data, setData] = useState([]);
    let [form, setForm] = useState(
        {
            id: '',
            nama: '',
            kode: '',
            tgl_libur: '',
            keterangan: '',
            id_sekolah: localStorage.getItem('id_sekolah')
        }
    );
    let [edit, setEdit] = useState(false);
    
    let formValue = {
        id: '',
        nama: '',
        kode: '',
        tgl_libur: '',
        keterangan: '',
        id_sekolah: localStorage.getItem('id_sekolah')
    }

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => {
        formValue = {
            id: '',
            nama: '',
            kode: '',
            tgl_libur: '',
            keterangan: '',
            id_sekolah: localStorage.getItem('id_sekolah')
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

        if(data.data != null){
            setData(data.data);
            console.log(data.data);
        }else{
            swal("Error", data.message, "warning");
        }
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
                id: res.data.data.id,
                nama: res.data.data.nama,
                kode: res.data.data.kode,
                tgl_libur: res.data.data.tgl_libur,
                keterangan: res.data.data.keterangan
            }

            setEdit(true);
            setForm(formValue);
            setShow(true);
        }else{
            swal("Error", res.message, "warning");
        }
    }

    const syncLibur = () => {

        swal({
            title: "Singkronsasi ?",
            text: "Yakin akan mengsingkronkan data ?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
            })
            .then( async (willDelete) => {
            if (willDelete) {
                console.log("dapat")
                
                let res = await sync ({id_sekolah: getIdSekolah()})
                console.log(res)
                if(res.status == 200){
                    getData();
                    swal("Good job!", "Sukses", "success");
                }else{
                    swal("Error", res.message, "warning");
                }
                

            } else {
                swal("Data aman");
            }
        });

        

    }

    const setAktif = async (id,action) => {
        let konfirm = {
            id: id,
            value : action
        };

        console.log(konfirm);

        let res = await statusActive(konfirm);
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
                case 1:
                  return(
                    //<span key={row.id} className="badge text-bg-success">Aktif</span>
                    <div key={cell} class="form-check form-switch" onChange={()=>setAktif(row.id, 0)}>
                        <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked" checked/>
                        <label class="form-check-label" for="flexSwitchCheckChecked">Aktif</label>
                    </div>
                  )
                  break;
                default:
                    return (
                    //<span key={cell} className="badge text-bg-danger">Tidak aktif</span>
                    <div key={cell} class="form-check form-switch" onChange={()=>setAktif(row.id, 1)}>
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
            dataField: 'nama',
            text: 'nama',
            sort: true
        },
        {
            dataField: 'tgl_libur',
            text: 'libur',
            sort: true
        },
        {
            dataField: 'keterangan',
            text: 'keterangan',
            sort: true
        },
        {
            dataField: 'status',
            text: 'status',
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
                <h1>Setting Libur</h1>
                <div className="section-header-breadcrumb">
                    <div className="breadcrumb-item active">
                        <Link to="/">Dashboard</Link>
                    </div>
                    <div className="breadcrumb-item">Setting Libur</div>
                </div>
            </div>

            <div className="container">
                <div className="card">
                    <div className="card-body">
                        <div className="container-fluid">
                            <button onClick={handleShow} className="btn btn-success">
                                <HiOutlinePlusCircle className="fs-6 mr-1" /> Tambah
                            </button> 

                            <button onClick={syncLibur} className="btn btn-info ms-1">
                                <AiOutlineCloudSync className="fs-6 mr-1" /> Sinkron Libur Nasional
                            </button>

                            <div className="mt-4">
                                <Tables data={data} column={column} columnFormats={columnFormat}/>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>

        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Tambah Libur</Modal.Title>
            </Modal.Header>
            <Modal.Body>

                <Formik
                initialValues={form}
                onSubmit={ async (values, { setSubmitting }) => {
                    let res = edit ? await updates(values) : await create(values);

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
                        <label htmlFor="role">Tanggal Libur</label>
                        <input
                            type="date"
                            name="tgl_libur"
                            className="form-control" 
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.tgl_libur}
                        />
                        {errors.tgl_libur && touched.tgl_libur && errors.tgl_libur}
                    </div>

                    <div className="form-group">
                        <label htmlFor="role">Keterangan</label>
                        <input
                            type="text"
                            name="keterangan"
                            className="form-control" 
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.keterangan}
                        />
                        {errors.keterangan && touched.keterangan && errors.keterangan}
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

export default LiburIndex