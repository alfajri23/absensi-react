import React, {useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import {HiOutlinePencilAlt , HiOutlineTrash, HiOutlinePlusCircle} from 'react-icons/hi';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { Formik } from 'formik';
import { getAll as getRombel } from '../../../api/api_rombel'
import { getAll, groupByHari, create, destroy, detail, updates } from '../../../api/setting/jadwal/api_jadwal_siswa'
import swal from 'sweetalert';

import LayoutAdmin from '../../../layouts/admin';
import Tables from '../../../components/table/table';


const JadwalSiswa = () => {

    let [data, setData] = useState([]);
    let [rombel, setRombel] = useState([]);
    let [form, setForm] = useState(
        {
            id: '',
            hari: '',
            role: 'siswa',
            toleransi: '',
            jam_masuk: '',
            jam_keluar: '',
            keterangan: ''
        }
    );
    let [edit, setEdit] = useState(false);
    
    let formValue = {
        id: '',
        hari: '',
        role: 'siswa',
        toleransi: '',
        jam_masuk: '',
        jam_keluar: '',
        keterangan: ''
    }

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => {
        getRombels();
        formValue = {
            id: '',
            hari: '',
            role: 'siswa',
            toleransi: '',
            jam_masuk: '',
            jam_keluar: '',
            keterangan: ''
        }

        setEdit(false);
        setForm(formValue);
        setShow(true);
    }

    useEffect(() => {
        getData();
    },[]);

    const getRombels = async () => {
        let data = await getRombel();
        console.log(data)
        setRombel(data.data)
    }

    const getData = async () => {
        let data = await groupByHari('siswa');
        console.log(data.data);
        setData(data.data);
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

    return (
        <LayoutAdmin>
        <div>
            <div className="section-header">
                <h1>Jadwal Siswa</h1>
                <div className="section-header-breadcrumb">
                    <div className="breadcrumb-item active">
                        <Link to="/">Dashboard</Link>
                    </div>
                    <div className="breadcrumb-item">Transaksi</div>
                </div>
            </div>

            <div className="section-header">
                <button type="button" className="btn btn-primary mx-1">Primary</button>
                <button type="button" className="btn btn-light mx-1">Secondary</button>
            </div>

            <div className="">
                <div className="card">
                    <div className="card-body">
                        <div className="container-fluid">
                            <button onClick={handleShow} className="btn btn-success">
                                <HiOutlinePlusCircle className="fs-6 mr-1" /> Tambah
                            </button>

                            {/* <table className="table table-bordered">
                                <thead>
                                    <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">First</th>
                                    <th scope="col">Last</th>
                                    <th scope="col">Handle</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                    <th scope="row">1</th>
                                    <td>Mark</td>
                                    <td>Otto</td>
                                    <td>@mdo</td>
                                    </tr>

                                    <tr>
                                    <th scope="row">2</th>
                                    <td rowSpan="2">Jacob</td>
                                    <td>Thornton</td>
                                    <td>@fat</td>
                                    </tr>

                                    <tr>
                                    <th scope="row">2</th>
                                    
                                    <td>Thornton</td>
                                    <td>@fat</td>
                                    </tr>
                                   
                                </tbody>
                            </table> */}

                            <table className="table mt-4">
                                <thead>
                                    <tr>
                                    <th scope="col">No</th>
                                    <th scope="col">Hari</th>
                                    <th scope="col">Toleransi</th>
                                    <th scope="col">Jam masuk</th>
                                    <th scope="col">Kelas</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((result,key) => {
                                        return(
                                            <tr key={key}>
                                                <th>1</th>
                                                <th scope="row">{result.hari}</th>
                                                <td>{result.toleransi}</td>
                                                <td>
                                                <tbody>
                                                {result.jadwal.map((result,key) => {
                                                    return(
                                                        <tr>{result.jam_masuk}</tr>
                                                    )
                                                })}
                                                </tbody>    
                                                </td>
                                                <td>{result.jadwal.map((result,key) => {
                                                    return(
                                                        <p>{result.toleransi}</p>
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
                        <label htmlFor="role">Hari</label>
                        <input
                            type="hari"
                            name="hari"
                            className="form-control" 
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.hari}
                        />
                        {errors.hari && touched.hari && errors.hari}
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

                    <div className="form-group">
                        <label htmlFor="rombel">Rombel</label>
                        <select name="rombel" as="select" id="rombel" className="form-select">
                            <option value="">-- Pilih --</option>
                            {rombel.map((result,key) => {
                                return(
                                    <option key={key} value={result.id}>{result.nama}</option>
                                )
                            })}
                           
                        </select>
                        {errors.rombel && touched.rombel && errors.rombel}
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

export default JadwalSiswa