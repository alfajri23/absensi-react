import React, {useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import {HiOutlinePencilAlt , HiOutlineTrash, HiOutlinePlusCircle} from 'react-icons/hi';
import Modal from 'react-bootstrap/Modal';
import { Formik, Field } from 'formik';
import { getAll, setActive, create, destroy, detail, updates } from '../../../api/api_tahunajar'
import swal from 'sweetalert';
import * as Yup from 'yup';

import LayoutAdmin from '../../../layouts/admin';
import { getIdSekolah } from '../../../auth/auth';
import Table from '../../../components/table/react-table';



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
        let res = await setActive(id);
        //console.log(res);
        getData();
        swal("Error", res.message, "warning");
        // if(res.status == 200){
        //     swal("Good job!", "Sukses", "success");
        // }else{
        // }

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
                    <div key={row.original.id} className="form-check form-switch" onChange={()=>setAktif(row.original.id)}>
                        <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked" checked/>
                        <label className="form-check-label" for="flexSwitchCheckChecked">Aktif</label>
                    </div>
                  )
                  break;
                default:
                    return (
                    <div key={row.original.id} className="form-check form-switch" onChange={()=>setAktif(row.original.id)}>
                        <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked"/>
                        <label className="form-check-label" for="flexSwitchCheckChecked">Tidak Aktif</label>
                    </div>
                )
            }
        }
    }

    const column = [
        {
            accessor: 'tahun_ajaran',
            Header: 'Nama',
        },
        {
            accessor: 'semester',
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
        semester: Yup.string()
          .required('Harus diisi'),
    });

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

                            <Table datas={data} column={column} columnFormats={columnFormat}/>

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
                        <label htmlFor="role">Tahun Ajaran</label>
                        <input
                            type="text"
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

export default TahunAjarIndex