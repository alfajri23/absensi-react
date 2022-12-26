import React, {useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import {HiOutlinePencilAlt , HiOutlineTrash, HiOutlinePlusCircle, HiOutlineKey} from 'react-icons/hi';
import Modal from 'react-bootstrap/Modal';
import { Formik, Field, Form } from 'formik';
import { getAll, create, destroy, detail, updates, getImportFile, importFile, resetPass as resetPassword, filterRombelTahun } from '../../../api/master/api_siswa'
import { getAll as getAllJurusan } from '../../../api/api_jurusan'
import { getAll as getRombel } from '../../../api/api_rombel';
import swal from 'sweetalert';
import * as Yup from 'yup';

import LayoutAdmin from '../../../layouts/admin';
import Table from '../../../components/table/react-table';
import { getIdSekolah, getTahun } from '../../../auth/auth';


const SiswaIndex = () => {

    let [data, setData] = useState([]);
    let [form, setForm] = useState(
        {
            id: '',
            nama: '',
            email: '',
            nik: '',
            nis: '',
            nisn: '',
            jenkel: '',
            telepon: '',
            agama: '',
            tempat_lahir: '',
            tgl_lahir: '',
        }
    );
    let [download, setDownload] = useState('');
    let [edit, setEdit] = useState(false);
    let [rombel, setRombel] = useState([]);
    
    let formValue = {
        id: '',
        nama: '',
        email: '',
        nik: '',
        nis: '',
        nisn: '',
        jenkel: '',
        telepon: '',
        agama: '',
        tempat_lahir: '',
        tgl_lahir: '',
    }

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => {
        formValue = {
            id: '',
            nama: '',
            email: '',
            nik: '',
            nis: '',
            nisn: '',
            jenkel: '',
            telepon: '',
            agama: '',
            tempat_lahir: '',
            tgl_lahir: '',
        }

        getDataJurusan();
        setEdit(false);
        setForm(formValue);
        setShow(true);
    }

    const [showImport, setShowImport] = useState(false);
    const handleCloseImport = () => setShowImport(false);
    const handleShowImport = () => setShowImport(true);
    

    useEffect(() => {
        getData();
        initRombel();
    },[]);

    const initRombel = async () => {
        let data = await getRombel();
        if(data.data != null){
            setRombel(data.data);
        }else{
            swal("Error", data.message, "warning");
        }
    }

    const tahun = () => {
        let tahun = getTahun() - 5;
        let list_tahun = [];
        for (let i = 0; i < 10; i++) {
            list_tahun.push(tahun++)
        }
        return list_tahun;
      }

    const getData = async () => {
        let data = await getAll();
        let download = getImportFile(getIdSekolah());
        if(data.data != null){
            setData(data.data);
            setDownload(download);
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
        console.log(res.data.data)
        if(res.status == 200){
            formValue ={
                ...formValue,
                id : res.data.data.id,
                nama: res.data.data.nama,
                email: res.data.data.email,
                nik: res.data.data.nik,
                nis: res.data.data.nis,
                nisn: res.data.data.nisn,
                jenkel: res.data.data.jenkel_kode,
                telepon: res.data.data.telepon,
                agama: res.data.data.agama,
                tempat_lahir: res.data.data.tempat_lahir,
                tgl_lahir: res.data.data.tgl_lahir,
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
                let res = await resetPassword(id);
        
                if(res.status == 200){
                    getData();
                    swal("Good job!", "Password baru : 12345", "success");
                }else{
                    swal("Error", res.message, "warning");
                }
                break;
           
              default:
                swal("Tidak ada perubahan");
            }
        });

        
    }

    const getFilter = async (id_rombel, tahun) => {
        let res = await filterRombelTahun(id_rombel, tahun);
        if(res.data.data != null){
            console.log(res.data)
            setData(res.data.data);
        }else{
            setData([]);
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
                    <button onClick={()=> resetPass(value)} type="button" className="btn btn-sm btn-outline-warning">
                        <HiOutlineKey className="fs-6" />
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
            accessor: 'nis',
            Header: 'NIM',
        },
        {
            accessor: 'telepon',
            Header: 'Telepon',
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
        email: Yup.string().email('Email tidak valid')
          .required('Harus diisi'),
        nik: Yup.string()
          .required('Harus diisi'),
        nis: Yup.string()
          .required('Harus diisi'),
        nisn: Yup.string()
          .required('Harus diisi'),
        telepon: Yup.string()
          .required('Harus diisi'),
        jenkel: Yup.string()
          .required('Harus diisi'),
        agama: Yup.string()
          .required('Harus diisi'),
    });


    return (
        <LayoutAdmin>
        <div>
            <div className="section-header">
                <h1>Siswa</h1>
                <div className="section-header-breadcrumb">
                    <div className="breadcrumb-item active">
                        <Link to="/admin">Dashboard</Link>
                    </div>
                    <div className="breadcrumb-item">Siswa</div>
                </div>
            </div>

            <div className="container">
                <div className="card">
                    <div className="card-body">
                        <div className="container-fluid">
                            <Formik
                                initialValues={{
                                    tahun: '',
                                    rombel: '',
                                }}
                                onSubmit={async (values)=>{
                                    await getFilter(values.rombel, values.tahun);
                                }}
                                >
                                {({
                                    isSubmitting,
                                    errors,
                                }) => (
                                <Form>
                                    <div className="d-flex">
                                        
                                        <div className="col-2">
                                            <label className="form-label">Tahun</label>
                                            <Field name="tahun" as="select" className="form-select">
                                                <option value="">-- pilih --</option>
                                                {tahun().map((result,key) => {
                                                  return (
                                                      <option key={key} value={result}>{result}</option>
                                                  )
                                                })}
                                            </Field>
                                            <small className="text-danger">{errors.tahun_ajar}</small>
                                        </div> 

                                        <div className="col-2 mx-1">
                                            <label className="form-label">Rombel</label>
                                            <Field name="rombel" as="select" className="form-select">
                                                <option value="">-- pilih --</option>
                                                {rombel.map((result,key) => {
                                                    return (
                                                        <option key={key} value={result.id}>{result.nama}</option>
                                                    )
                                                })}
                                            </Field>
                                            <small className="text-danger">{errors.rombel}</small>
                                        </div> 

                                        <div className="col-auto mx-1">
                                            <label className="form-label">&nbsp;</label><br></br>
                                            <button type="submit" className="btn btn-nu btn-block" disabled={isSubmitting}>
                                                { isSubmitting ? 
                                                    <>
                                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                    <span className="sr-only ms-1">Loading...</span>
                                                    </>
                                                : 'Cari'}
                                            </button>
                                        </div>

                                        <div className="col-auto mx-1">
                                            <label className="form-label">&nbsp;</label><br></br>
                                            <button onClick={handleShowImport} className="btn btn-info">
                                                Tambah
                                            </button>
                                        </div>

                                    </div> 
                                </Form>
                                )}

                            </Formik>

                            <Table datas={data} column={column} columnFormats={columnFormat}/>

                        </div>
                    </div>
                </div>
            </div>
        </div>

        <Modal size="lg" show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Tambah Siswa</Modal.Title>
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
                <form className="form-row row" onSubmit={handleSubmit}>
                    <div className="form-group col-6">
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

                    <div className="form-group col-6">
                        <label htmlFor="role">Email</label>
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

                    <div className="form-group col-7">
                        <label htmlFor="role">Tempat lahir</label>
                        <input
                            type="text"
                            name="tempat_lahir"
                            className="form-control" 
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.tempat_lahir}
                        />
                        {errors.tempat_lahir && touched.tempat_lahir && errors.tempat_lahir}
                    </div>

                    <div className="form-group col-5">
                        <label htmlFor="role">Tanggal lahir</label>
                        <input
                            type="date"
                            name="tgl_lahir"
                            className="form-control" 
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.tgl_lahir}
                        />
                        {errors.tgl_lahir && touched.tgl_lahir && errors.tgl_lahir}
                    </div>

                    <div className="form-group col-4">
                        <label htmlFor="role">NIK</label>
                        <input
                            type="number"
                            name="nik"
                            className="form-control" 
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.nik}
                        />
                        {errors.nik && touched.nik && errors.nik}
                    </div>

                    <div className="form-group col-4">
                        <label htmlFor="role">nis</label>
                        <input
                            type="number"
                            name="nis"
                            className="form-control" 
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.nis}
                        />
                        {errors.nis && touched.nis && errors.nis}
                    </div>

                    <div className="form-group col-4">
                        <label htmlFor="role">nisn</label>
                        <input
                            type="number"
                            name="nisn"
                            className="form-control" 
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.nisn}
                        />
                        {errors.nisn && touched.nisn && errors.nisn}
                    </div>

                    <div className="form-group col-4">
                        <label htmlFor="role">Jenis Kelamin</label>
                        <Field name="jenkel" as="select" className="form-select">
                            <option value="">-- Pilih --</option>
                            <option value="l">Laki-laki</option>
                            <option value="p">Perempuan</option>
                        </Field>
                        {errors.jenkel && touched.jenkel && errors.jenkel}
                    </div>

                    <div className="form-group col-4">
                        <label htmlFor="role">Agama</label>
                        <Field name="agama" as="select" className="form-select">
                            <option value="">-- Pilih --</option>
                            <option value="islam">islam</option>
                            <option value="kristen">kristen</option>
                            <option value="katolik">katolik</option>
                            <option value="hindu">hindu</option>
                            <option value="budha">budha</option>
                            <option value="konghucu">konghucu</option>
                        </Field>
                        {errors.agama && touched.agama && errors.agama}
                    </div>

                    <div className="form-group col-4">
                        <label htmlFor="role">Telepon</label>
                        <input
                            type="number"
                            name="telepon"
                            className="form-control" 
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.telepon}
                        />
                        {errors.telepon && touched.telepon && errors.telepon}
                    </div>

                    <div className="form-group col-4">
                        <button type="submit" className="btn btn-nu btn-lg btn-block" disabled={isSubmitting}>
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

        <Modal size="lg" show={showImport} onHide={handleCloseImport}>
            <Modal.Header closeButton>
                <Modal.Title>Import Siswa</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Silakan download file template terlebih dahulu, <a href={download}> Download</a></p>
                <Formik
                initialValues={{
                    file: ''
                }}
                onSubmit={ async (values, { setSubmitting }) => {
                    const formData = new FormData();
                    formData.append('file', values.file);
                    let res = await importFile(formData, getTahun());

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

export default SiswaIndex