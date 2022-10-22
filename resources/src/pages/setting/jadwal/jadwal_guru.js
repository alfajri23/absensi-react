import React, {useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import {HiOutlinePencilAlt , HiOutlineTrash, HiOutlinePlusCircle} from 'react-icons/hi';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { Formik, Field } from 'formik';
import { getAll as getRombel } from '../../../api/api_rombel'
import { getAll, groupByHari, create, destroy, detail, updates } from '../../../api/setting/jadwal/api_jadwal'
import swal from 'sweetalert';
import Select from 'react-select'

import LayoutAdmin from '../../../layouts/admin';
import Tables from '../../../components/table/table';
import { getIdSekolah } from '../../../auth/auth';


const JadwalGuru = () => {

    let [data, setData] = useState([]);
    let [form, setForm] = useState(
        {
            id: '',
            hari: '',
            role: 'guru',
            toleransi: '',
            jam_masuk: '',
            jam_pulang: '',
            keterangan: '',
            id_sekolah: getIdSekolah()
        }
    );
    let [edit, setEdit] = useState(false);
    
    let formValue = {
        id: '',
        hari: '',
        role: 'guru',
        toleransi: '',
        jam_masuk: '',
        jam_pulang: '',
        keterangan: '',
        id_sekolah: getIdSekolah()
    }

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => {
        formValue = {
            id: '',
            hari: '',
            role: 'guru',
            toleransi: '',
            jam_masuk: '',
            jam_pulang: '',
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
        let data = await groupByHari('guru');
        
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
            console.log('database',res.data.data);

            formValue ={
                ...formValue,
                id : res.data.data.id,
                hari: res.data.data.hari,
                jam_masuk: res.data.data.jam_masuk,
                jam_pulang: res.data.data.jam_pulang,
                toleransi: res.data.data.toleransi,
                keterangan: res.data.data.keterangan,
            }

            
            setEdit(true);
            setForm(formValue);
            console.log('form_value',formValue);
            console.log('state',form);
            setShow(true);
        }else{
            swal("Error", res.message, "warning");
        }

    }

    return (
        <LayoutAdmin>
        <div>
            <div className="section-header">
                <h1>Jadwal Guru</h1>
                <div className="section-header-breadcrumb">
                    <div className="breadcrumb-item active">
                        <Link to="/">Dashboard</Link>
                    </div>
                    <div className="breadcrumb-item">Jadwal Guru</div>
                </div>
            </div>

            <div className="section-header">
                <Link to="/setting/jadwal-siswa" className="btn btn-lighr mx-1">Siswa</Link>
                <Link to="/setting/jadwal-guru" className="btn btn-primary mx-1">Guru</Link>
            </div>

            <div className="">
                <div className="card">
                    <div className="card-body">
                        <div className="container-fluid">
                            <button onClick={handleShow} className="btn btn-success">
                                <HiOutlinePlusCircle className="fs-6 mr-1" /> Tambah
                            </button>

                            <table className="table mt-4">
                                <thead>
                                    <tr>
                                    <th scope="col">No</th>
                                    <th scope="col">Hari</th>
                                    <th scope="col">Jam masuk</th>
                                    <th scope="col">Toleransi</th>
                                    <th scope="col">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((result,key) => {
                                        return(
                                            <tr key={key}>
                                                <th>1</th>
                                                <th scope="row">{result.hari}</th>

                                                <td> 
                                                {result.jadwal.map((result,key) => {
                                                    return(
                                                        <p className="mt-1">{result.jam_masuk}</p>
                                                    )
                                                })}
                                                </td>

                                                <td> 
                                                {result.jadwal.map((result,key) => {
                                                    return(
                                                        <p key={key} className="mt-1">{result.toleransi}</p>
                                                    )
                                                })}
                                                </td>

                                                <td>{result.jadwal.map((result,key) => {
                                                    return(
                                                        
                                                        <div key={key} className="btn-group" role="group" aria-label="Basic outlined example">
                                                            <button onClick={()=> detailData(result.id)} type="button" className="btn btn-sm btn-outline-primary">
                                                                <HiOutlinePencilAlt className="fs-6" />
                                                            </button>
                                                            <button onClick={()=> deleteData(result.id)} type="button" className="btn btn-sm btn-outline-danger">
                                                                <HiOutlineTrash className="fs-6" />
                                                            </button>
                                                        </div>
                                                        
                                                        
                                                    )
                                                })}</td>


                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>

                        </div>
                    </div>
                </div>
            </div>
        </div>

        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Tambah Jadwal Harian</Modal.Title>
            </Modal.Header>
            <Modal.Body>

                <Formik
                initialValues={form}
                onSubmit={ async (values, { setSubmitting }) => {

                    console.log('data form',values);

                    
                    let res = await edit ? updates(values.id, values) : create(values);
                    res = await res;

                    //let res = values.rombel.forEach(myFunction);
                    // values.rombel.forEach(myFunction);

                    // async function myFunction(value, index, array) {
                    //     let values_new = {
                    //         ...values,

                    //     }

                    //     console.log('data kirim',values_new);
                        
                    //     let res = await edit ? updates(values_new.id,values_new) : create(values_new);
                    //     let done = await res;
                    //     console.log(done);
                    // }


                    
                    console.log(res);
                    
                    if(res.status == 200){
                        getData();
                        swal("Good job!", "sukses", "success");  
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
                    setFieldValue,
                    /* and other goodies */
                }) => (
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="role">Hari</label>
                        <Field name="hari" as="select" id="hari" className="form-select" disabled={edit}>
                            <option value="">-- Pilih --</option>
                            <option value="Senin">senin</option>
                            <option value="Selasa">selasa</option>
                            <option value="Rabu">rabu</option>
                            <option value="Kamis">kamis</option>
                            <option value="Jumat">jumat</option>
                            <option value="Sabtu">sabtu</option>
                            <option value="Minggu">minggu</option>
                        </Field>
                        {errors.hari && touched.hari && errors.hari}
                    </div>

                    <div className="row">
                        <div className="col">
                            <div className="form-group">
                                <label htmlFor="role">Jam Masuk</label>
                                <input
                                    type="time"
                                    name="jam_masuk"
                                    className="form-control" 
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.jam_masuk}
                                />
                                {errors.jam_masuk && touched.jam_masuk && errors.jam_masuk}
                            </div>
                        </div>

                        <div className="col">
                            <div className="form-group">
                                <label htmlFor="role">Jam Pulang</label>
                                <input
                                    type="time"
                                    name="jam_pulang"
                                    className="form-control" 
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.jam_pulang}
                                    
                                />
                                {errors.jam_pulang && touched.jam_pulang && errors.jam_pulang}
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="role">Toleransi</label>
                        <input
                            type="number"
                            name="toleransi"
                            className="form-control" 
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.toleransi}
                        />
                        {errors.toleransi && touched.toleransi && errors.toleransi}
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

export default JadwalGuru