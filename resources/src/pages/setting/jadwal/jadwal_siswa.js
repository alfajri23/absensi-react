import React, {useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import {HiOutlinePencilAlt , HiOutlineTrash, HiOutlinePlusCircle} from 'react-icons/hi';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { Formik, Field } from 'formik';
import { getAll as getRombel } from '../../../api/api_rombel'
import { getAll, groupByHari, create, destroy, detail, updates } from '../../../api/setting/jadwal/api_jadwal'
import swal from 'sweetalert';
import Select from 'react-select';
import * as Yup from 'yup';

import LayoutAdmin from '../../../layouts/admin';
import { getIdSekolah } from '../../../auth/auth';


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
            jam_pulang: '',
            rombel: [],
            keterangan: '',
            id_sekolah: getIdSekolah()
        }
    );

    const validateForm  = Yup.object().shape({
        hari: Yup.string()
          .required('Harus diisi'),
        jam_masuk: Yup.string()
          .required('Harus diisi'),
        jam_pulang: Yup.string()
          .required('Harus diisi'),
       
    });

    let [edit, setEdit] = useState(false);
    
    let formValue = {
        id: '',
        hari: '',
        role: 'siswa',
        toleransi: '',
        jam_masuk: '',
        jam_pulang: '',
        rombel: [],
        keterangan: '',
        id_sekolah: getIdSekolah()
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
            jam_pulang: '',
            rombel: [],
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

    const getRombels = async () => {
        let data = await getRombel();

        let rombel = data.data.map(item => {
            return {
              value: item.id,
              label: item.nama
            };
        });
        setRombel(rombel)
    }

    const getData = async () => {
        let data = await groupByHari('siswa');
        if(data.data != null){
            console.log(data.data)
            setData(data.data);
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
        getRombels();
        let res = await detail(id);

        if(res.status == 200){
            formValue ={
                ...formValue,
                id : res.data.data.id,
                hari: res.data.data.hari,
                jam_masuk: res.data.data.jam_masuk,
                jam_pulang: res.data.data.jam_pulang,
                toleransi: res.data.data.toleransi,
                keterangan: res.data.data.keterangan,
                rombel: [
                    {
                        value: res.data.data.rombels[0].id,
                        label: res.data.data.rombels[0].nama
                    }  
                ],
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
                    <div className="breadcrumb-item">Jadwal Siswa</div>
                </div>
            </div>

            <div className="section-header">
                <Link to="/setting/jadwal-siswa" className="btn btn-primary mx-1">Siswa</Link>
                <Link to="/setting/jadwal-guru" className="btn btn-light mx-1">Guru</Link>
            </div>

            <div className="">
                <div className="card">
                    <div className="card-body">
                        <div className="container-fluid">
                            <button onClick={handleShow} className="btn btn-success">
                                <HiOutlinePlusCircle className="fs-6 mr-1"/> Tambah
                            </button>

                            <table className="table mt-4 table-striped">
                                <thead>
                                    <tr>
                                    <th scope="col">No</th>
                                    <th scope="col">Hari</th>
                                    <th scope="col">Jam masuk</th>
                                    <th scope="col">Toleransi</th>
                                    <th scope="col">Kelas</th>
                                    <th scope="col">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((result,key) => {
                                        return(
                                            <tr key={key}>
                                                <th>{key+1}</th>
                                                <th scope="row">{result.hari}</th>

                                                <td> 
                                                {result.jadwal.map((result,key) => {
                                                    return(
                                                        <div key={key} className="my-1">{result.jam_masuk}</div>
                                                    )
                                                })}
                                                </td>

                                                <td> 
                                                {result.jadwal.map((result,key) => {
                                                    return(
                                                        <div key={key} className="my-1">{result.toleransi}</div>
                                                    )
                                                })}
                                                </td>

                                                <td>{result.jadwal.map((result,key) => {
                                                    return(
                                                        //<div key={key} className="my-1">{result.rombels[0]}</div>
                                                        <div className="my-1">
                                                            {result.rombels.map((result,key) =>{
                                                                return(<span>{result.nama}</span>)
                                                            })}
                                                        </div>
                                                    )
                                                })}</td>

                                                <td>{result.jadwal.map((result,key) => {
                                                    return(
                                                        <div key={key} className="mt-1">
                                                        <div className="btn-group" role="group" aria-label="Basic outlined example">
                                                            <button onClick={()=> detailData(result.id)} type="button" className="btn btn-sm btn-outline-primary">
                                                                <HiOutlinePencilAlt className="fs-6" />
                                                            </button>
                                                            <button onClick={()=> deleteData(result.id)} type="button" className="btn btn-sm btn-outline-danger">
                                                                <HiOutlineTrash className="fs-6" />
                                                            </button>
                                                        </div>
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
                onSubmit={ (values, { setSubmitting }) => {
                    values.rombel.forEach(myFunction);
                    async function myFunction(value, index, array) {
                        let values_new = {
                            ...values,
                            rombel: value.value
                        }

                        let res = await edit ? updates(values_new.id,values_new) : create(values_new);
                        let done = await res;
                    }

                    setTimeout(function(){ 
                        getData();
                        swal("Good job!", "Sukses", "success");
                    }, 1500);
                    
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
                        <label htmlFor="rombel">Rombel</label>

                        <Select
                        placeholder="rombel"
                        value={values.rombel}
                        onChange={(option, action) => {
                            setFieldValue('rombel', option);
                        }}
                        isSearchable={true}
                        options={rombel}
                        name="rombel"
                        isMulti
                        isLoading={false}
                        loadingMessage={() => "Fetching rombel"}
                        noOptionsMessage={() => "rombel appears here"}
                        />

                        {errors.rombel && touched.rombel && errors.rombel}

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

                    <Button type="submit" className="btn btn-success w-100" disabled={isSubmitting}>
                        { isSubmitting ? 
                        <>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        </>
                        : 'Kirim'}
                    </Button>
                </form>
                )}
                </Formik>

            </Modal.Body>

        </Modal>
        
        </LayoutAdmin>
    )
}

export default JadwalSiswa