import React, {useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import {HiOutlinePencilAlt , HiOutlineTrash, HiOutlinePlusCircle, HiOutlineKey} from 'react-icons/hi';
import Modal from 'react-bootstrap/Modal';
import { Formik } from 'formik';
import { getAll, create, destroy, detail, setActive, resetPassword } from '../../../api/master/api_admin'
import swal from 'sweetalert';
import * as Yup from 'yup';

import LayoutAdmin from '../../../layouts/admin';
import { getIdSekolah } from '../../../auth/auth';
import Table from '../../../components/table/react-table';


const AdminIndex = () => {

    let [data, setData] = useState([]);
    let [form, setForm] = useState(
        {
            id: '',
            nama: '',
            email: '',
            file:'',
            id_sekolah: getIdSekolah()
        }
    );

    let [edit, setEdit] = useState(false);
    
    let formValue = {
        id: '',
        nama: '',
        email: '',
        file:'',
        id_sekolah: getIdSekolah()
    }

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => {
        formValue = {
            id: '',
            nama: '',
            email: '',
            file:'',
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
                email: res.data.data.email,
                password: ''
            }

            setEdit(true);
            setShow(true);
            setForm(formValue);
        }else{
            swal("Error", res.message, "warning");
        }

    }

    const setAktif = async (id,value) => {
        console.log("data");
        let res = await setActive({
            id: id,
            status: value
        });

        if(res.status == 200){
            getData();
            swal("Good job!", res.data.message, "success");
        }else{
            swal("Error", res.message, "warning");
        }

    }

    const resetPass = async (id) => {

        swal("Apakah anda yakin untuk mereset password ?", {
            buttons: {
              cancel: "Batal",
              catch: {
                text: "Reset",
                value: "catch",
              },
            },
          })
          .then( async(value) => {
            switch (value) {          
              case "catch":
                let res = await resetPassword({
                    id: id,
                    password: 12345
                });
        
                if(res.status == 200){
                    getData();
                    swal("Good job!", "Password baru admin : 12345", "success");
                }else{
                    swal("Error", res.message, "warning");
                }
                break;
           
              default:
                swal("Tidak ada perubahan");
            }
        });

        
    }

    const columnFormat = {
        action: ({value, row}) => {
            return(
                <div key={value} className="btn-group" role="group" aria-label="Basic outlined example">
                    <button onClick={()=> detailData(row.original.id)
                    } type="button" className="btn btn-sm btn-outline-primary">
                        <HiOutlinePencilAlt className="fs-6" />
                    </button>
                    <button onClick={()=> deleteData(row.original.id)} type="button" className="btn btn-sm btn-outline-danger">
                        <HiOutlineTrash className="fs-6" />
                    </button>
                    <button onClick={()=> resetPass(row.original.id)} type="button" className="btn btn-sm btn-outline-warning">
                        <HiOutlineKey className="fs-6" />
                    </button>
                </div>
            )
        },
        status: ({value, row}) => {
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
                        <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked" defaultChecked={false}/>
                        <label className="form-check-label" htmlFor="flexSwitchCheckChecked">Tidak Aktif</label>
                    </div>
                )
            }
        },

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
            accessor: 'email',
            Header: 'Email',
            
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
    ];

    const validateForm  = Yup.object().shape({
        nama: Yup.string()
          .required('Harus diisi'),
        email: Yup.string().email('Email tidak valid')
          .required('Harus diisi'),
    });

    return (
        <LayoutAdmin>
        <div>
            <div className="section-header">
                <h1>Admin</h1>
                <div className="section-header-breadcrumb">
                    <div className="breadcrumb-item active">
                        <Link to="/">Dashboard</Link>
                    </div>
                    <div className="breadcrumb-item">Admin</div>
                </div>
            </div>

            <div className="container">
                <div className="card">
                    <div className="card-body">
                        <div className="container-fluid">
                            <button onClick={handleShow} className="btn btn-success">
                                <HiOutlinePlusCircle className="fs-6 mr-1" /> Tambah
                            </button>
                           
                            <div>
                                <Table datas={data} column={column} columnFormats={columnFormat}/>
                            </div>
                        
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{ !edit ? 'Tambah' : 'Edit'} Admin</Modal.Title>
            </Modal.Header>
            <Modal.Body>

                <Formik
                initialValues={form}
                onSubmit={ async (values, { setSubmitting }) => {

                    const formData = new FormData();
                    formData.append('id', values.id);
                    formData.append('nama', values.nama);
                    formData.append('email', values.email);
                    formData.append('password', values.password);
                    formData.append('file', values.file);
                    formData.append('id_sekolah', values.id_sekolah);
                    
                    let res = await create(formData);
                    
                    
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
                        <label >Nama</label>
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
                        <label >Email</label>
                        <input
                            type="email"
                            name="email"
                            className="form-control" 
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.email}
                        />
                        {errors.email && touched.email && errors.email}
                    </div>

                    { !edit ? 
                        <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            className="form-control" 
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.password}
                        />
                        {errors.password && touched.password && errors.password}
                    </div>
                    : ''}
                    

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

export default AdminIndex