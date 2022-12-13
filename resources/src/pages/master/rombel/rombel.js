import React, {useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import {HiOutlinePencilAlt , HiOutlineTrash, HiOutlinePlusCircle} from 'react-icons/hi';
import Modal from 'react-bootstrap/Modal';
import { Formik } from 'formik';
import { getAll, create, destroy, detail, updates } from '../../../api/api_rombel'
import { getAll as getAllKelas } from '../../../api/api_kelas'
import swal from 'sweetalert';
import * as Yup from 'yup';

import LayoutAdmin from '../../../layouts/admin';
import Table from '../../../components/table/react-table';

const RombelIndex = () => {

    let [data, setData] = useState([]);
    let [form, setForm] = useState(
        {
            id: '',
            nama: '',
            id_kelas: '',
        }
    );
    let [kelas, setKelas] = useState([]);
    let [edit, setEdit] = useState(false);
    
    let formValue = {
        id: '',
        nama: '',
        id_kelas: '',
    }

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => {
        formValue = {
            id: '',
            nama: '',
            id_kelas: '',
        }

        getDataKelas();
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
            formValue ={
                ...formValue,
                id : res.data.data.id,
                nama: res.data.data.nama,
                id_kelas: res.data.data.id_kelas,
            }

            setEdit(true);
            setShow(true);
            getDataKelas();
            setForm(formValue);
        }else{
            swal("Error", res.message, "warning");
        }

    }

    const getDataKelas = async () => {
        let data = await getAllKelas();
        setKelas(data.data);
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
            accessor: '',
            Header: 'Id',
        },
        {
            accessor: 'nama',
            Header: 'Nama',
        },
        {
            accessor: 'jurusan',
            Header: 'Jurusan',
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
                <h1>Rombel</h1>
                <div className="section-header-breadcrumb">
                    <div className="breadcrumb-item active">
                        <Link to="/">Dashboard</Link>
                    </div>
                    <div className="breadcrumb-item">Rombel</div>
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
                <Modal.Title>Tambah Rombel</Modal.Title>
            </Modal.Header>
            <Modal.Body>

                <Formik
                initialValues={form}
                onSubmit={ async (values, { setSubmitting }) => {
                    console.log(values);
                    
                    let res = edit ? await create(values) : await create(values);
                    
                    
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
                        <label htmlFor="role">Kelas</label>
                        <select className="form-control" onChange={handleChange}
                            onBlur={handleBlur} name="id_kelas" value={values.id_kelas}>
                            <option value=''>Pilih</option>
                            { kelas.map((result,key) => {
                                return (  
                                    <option key={key} value={result.id}>{result.nama} {result.jurusan}</option>
                                    )
                            })}   
                        </select>
                        {errors.id_kelas && touched.id_kelas && errors.id_kelas}
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

export default RombelIndex