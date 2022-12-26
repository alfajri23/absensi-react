import React, {useEffect, useState, useRef} from 'react'
import { Link } from 'react-router-dom'
import {HiOutlinePencilAlt , HiOutlineTrash, HiOutlinePlusCircle} from 'react-icons/hi';
import {CiImport} from 'react-icons/ci';
import Modal from 'react-bootstrap/Modal';
import { Formik } from 'formik';
import { getAll, create, destroy, detail, updates, getImportFile, importFile } from '../../../api/api_jurusan'
import swal from 'sweetalert';
import * as Yup from 'yup';

import LayoutAdmin from '../../../layouts/admin';
import Table from '../../../components/table/react-table';


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

    let fileImport = useRef('');

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

    const [showImport, setShowImport] = useState(false);
    const handleCloseImport = () => setShowImport(false);
    const handleShowImport = () => setShowImport(true);

    useEffect(() => {
        getData();
    },[]);

    const getData = async () => {
        let data = await getAll();
        fileImport.current = getImportFile();
        
        if(data.data != null){
            setData(data.data);

        }else{
            swal("Error", data.message, "warning");
        }
    }

    const deleteData = async (id) => {
        swal({
            title: "Hapus ?",
            text: "Yakin unutk menghapus ini ?",
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
        action: ({value, row}) => {
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
        status: ({value, row}) => {
            switch(value) {
                case 'Aktif':
                  return(
                    <span key={row.original.id} className="badge text-bg-success">Aktif</span>
                  )
                  break;
                default:
                    return (
                    <span key={row.original.id} className="badge text-bg-danger">Tidak aktif</span>
                )
            }
        }
    }

    const column = [
        {
            accessor: 'nama',
            Header: 'Nama',
        },
        {
            accessor: 'status',
            Header: 'Status',
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
    });


    return (
        <LayoutAdmin>
        <div>
            <div className="section-header">
                <h1>Jurusan</h1>
                <div className="section-header-breadcrumb">
                    <div className="breadcrumb-item active">
                        <Link to="/admin">Dashboard</Link>
                    </div>
                    <div className="breadcrumb-item">Jurusan</div>
                </div>
            </div>

            <div className="container">
                <div className="card">
                    <div className="card-body">
                        <div className="container-fluid">
                            <button onClick={handleShow} className="btn btn-success">
                                <HiOutlinePlusCircle className="fs-6 mr-1" /> Tambah
                            </button>

                            <button onClick={handleShowImport} className="btn btn-warning ms-3">
                                <CiImport className="fs-6 mr-1" /> Import
                            </button>

                            <Table datas={data} column={column} columnFormats={columnFormat}/>
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
                    let res = edit ? await updates(values) : await create(values);
                    
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

        <Modal size="lg" show={showImport} onHide={handleCloseImport}>
            <Modal.Header closeButton>
                <Modal.Title>Import Jurusan</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Silakan download file template terlebih dahulu, <a href={fileImport.current}> Download</a></p>
                <Formik
                initialValues={{
                    file: ''
                }}
                onSubmit={ async (values, { setSubmitting }) => {
                    const formData = new FormData();
                    formData.append('file', values.file);
                    let res = await importFile(formData);

                    if(res.status == 200){
                        getData();
                        swal("Good job!", "Sukses", "success");
                    }else{
                        swal("Error", res.message[0].error, "warning");
                    }

                }}
                validationSchema={
                    Yup.object().shape({
                        file: Yup.string()
                          .required('Harus diisi')
                    })
                }
                >
                {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    isSubmitting,
                    setFieldValue
                    /* and other goodies */
                }) => (
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label >File</label>
                            <input
                                type="file"
                                name="file"
                                className="form-control" 
                                onBlur={handleBlur}
                                onChange={(event) => {
                                    setFieldValue("file", event.currentTarget.files[0]);
                                }}
                            />
                            {errors.file && touched.file && errors.file}
                        </div>
                        <div className="form-group">
                            <button type="submit" className="btn btn-nu btn-block" disabled={isSubmitting}>
                                { isSubmitting ? 
                                    <>
                                    <span className="spinner-border spinner-border-sm mr-1" role="status" aria-hidden="true"></span>
                                    <span className="sr-only">Loading...</span>
                                    </>
                                : 'Kirim'}
                            </button>
                        </div>
                    </form>

                )}

                </Formik>

            </Modal.Body>
        </Modal>
        
        </LayoutAdmin>
    )
}

export default JurusanIndex