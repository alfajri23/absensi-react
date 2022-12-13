import React, {useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import {HiOutlinePencilAlt , HiOutlineTrash, HiOutlinePlusCircle} from 'react-icons/hi';
import { AiOutlineCloudSync } from 'react-icons/ai';
import Modal from 'react-bootstrap/Modal';
import { Formik } from 'formik';
import { getAll, create, destroy, detail, updates, sync, statusActive } from '../../api/api_libur'
import swal from 'sweetalert';
import * as Yup from 'yup';

import LayoutAdmin from '../../layouts/admin';
import Table from '../../components/table/react-table';
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
            id_sekolah: getIdSekolah()
        }
    );
    let [edit, setEdit] = useState(false);
    
    let formValue = {
        id: '',
        nama: '',
        kode: '',
        tgl_libur: '',
        keterangan: '',
        id_sekolah: getIdSekolah()
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

        if(data.data != null){
            setData(data.data)
        }else{
            swal("Error", data.message, "warning");
        }
    }

    const deleteData = async (id) => {

        swal({
            title: "Hapus ?",
            text: "Yakin untuk menghapus ini ?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
        .then(async (willDelete) => {
            if (willDelete) {
                let res = await destroy(id);

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

        let res = await statusActive(konfirm);
        if(res.status == 200){
            getData();
            swal("Good job!", "Sukses", "success");
        }else{
            swal("Error", res.message, "warning");
        }

    }

    const columnFormat = {
        date: ({value, row}) => {
            let date = new Date(value);
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            return date.toLocaleDateString('id', options)
        },
        action: ({ value, row }) => {
            return(
                <div key={value} className="btn-group" role="group" aria-label="Basic outlined example">
                    <button onClick={()=> detailData(value)} type="button" className="btn btn-sm btn-outline-primary">
                        <HiOutlinePencilAlt className="fs-6" />
                    </button>
                    <button onClick={()=> deleteData(value)} type="button" className="btn btn-sm btn-outline-danger">
                        <HiOutlineTrash className="fs-6" />
                    </button>
                    
                </div>
            )
        },
        status: ({ value, row }) => {
            switch(value) {
                case 1:
                  return(
                    <div key={row.original.id} className="form-check form-switch" onChange={()=>setAktif(row.original.id, 0)}>
                        <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked" defaultChecked={true}/>
                        <label className="form-check-label" htmlFor="flexSwitchCheckChecked">Aktif</label>
                    </div>
                  )
                  break;
                default:
                    return (
                    <div key={row.original.id} className="form-check form-switch" onChange={()=>setAktif(row.original.id, 1)}>
                        <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked"/>
                        <label className="form-check-label" htmlFor="flexSwitchCheckChecked">Tidak Aktif</label>
                    </div>
                )
            }
        }
    }

    const column = [
        {
            accessor: '',
            Header: 'Id',
        },
        {
            accessor: 'nama',
            Header: 'nama',
        },
        {
            accessor: 'tgl_libur',
            Header: 'libur',
            Cell: columnFormat.date
        },
        {
            accessor: 'keterangan',
            Header: 'keterangan',
        },
        {
            accessor: 'status',
            Header: 'status',
            Cell: columnFormat.status
        },
        {
            accessor: 'id',
            Header: 'Action',
            Cell: columnFormat.action
        },
    ]

    const validateForm  = Yup.object().shape({
        nama: Yup.string()
          .required('Harus diisi'),
        tgl_libur: Yup.string()
          .required('Harus diisi'),
    });



    return (
        <LayoutAdmin>
        <div>
            <div className="section-header">
                <h1>Setting Libur</h1>
                <div className="section-header-breadcrumb">
                    <div className="breadcrumb-item active">
                        <Link to="/admin">Dashboard</Link>
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
                                <Table datas={data} column={column} columnFormats={columnFormat}/>
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
                    let req = {
                        ...values,
                        id_sekolah: getIdSekolah()
                    }
                    let res = edit ? await updates(req) : await create(req);

                    if(res.status == 200){
                        getData();
                        swal("Good job!", "Sukses", "success");
                    }else{
                        swal("Error", res.message, "warning");
                    }
                    setShow(false)
                }}
                validationSchema={validateForm}
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
                        <small className="text-danger">{errors.nama && touched.nama && errors.nama}</small>
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
                        <small className="text-danger">{errors.tgl_libur && touched.tgl_libur && errors.tgl_libur}</small>
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
                        <small className="text-danger">{errors.keterangan && touched.keterangan && errors.keterangan}</small>
                    </div>

                    <button type="submit" className="btn btn-nu btn-block" disabled={isSubmitting}>
                        { isSubmitting ? 
                            <>
                            <span className="spinner-border spinner-border-sm mr-1" role="status" aria-hidden="true"></span>
                            <span className="sr-only">Loading...</span>
                            </>
                        : 'Kirim'}
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