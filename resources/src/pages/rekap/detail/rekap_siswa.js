import React, {useEffect, useState, useRef} from 'react'
import { Link } from 'react-router-dom'
import { Formik, Field, Form } from 'formik';
import { getAll as getTahunAjar } from '../../../api/api_tahunajar';
import { getAll as getRombel } from '../../../api/api_rombel';
import swal from 'sweetalert'; 
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import * as Yup from 'yup';

import LayoutAdmin from '../../../layouts/admin';
import { detailRekapSiswa, detailKehadiran, updateKehadiran } from '../../../api/rekap/kehadiran/api_kehadiran';
import ReactToPrint from 'react-to-print';
import { HiBadgeCheck, HiExclamationCircle, HiMinusCircle, HiExclamation, HiMinusSm} from "react-icons/hi";
import { getIdSekolah, getTahunAjar as tahunAjarAuth } from '../../../auth/auth';
import { StyleRoot } from 'radium';
import { absenAdmin } from '../../../api/master/api_siswa';

const ref = React.createRef();


const RekapKehadiranSiswa = () => {

    const style = {
        transform: 'scale(1.0)',
        '@media print' : {
            transform: 'scale(0.5)',
            margin: '15px',
            '-webkit-transform-origin-x': 0
        },
    };
    const id_ta_sm = useRef('');
    const id_sekolah = useRef(getIdSekolah());
    const bulan_ref = useRef('');
    const rombel_ref = useRef('');

    let [data, setData] = useState([]);
    let [tahunAjar, setTahunAjar] = useState([]);
    let [rombel, setRombel] = useState([]);
    let [form, setForm] = useState({
        id: '',
        id_user: '',
        tgl_kehadiran: '',
        status_kehadiran: '',
        keterangan: '',
        id_ta_sm : id_ta_sm.current,
        id_sekolah: id_sekolah.current,
    });

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => {
        formValue = {
            id: '',
            id_user: '',
            tgl_kehadiran: '',
            status_kehadiran: '',
            keterangan: '',
            id_ta_sm : id_ta_sm.current,
            id_sekolah: id_sekolah.current,
            long : '',
            lat : '',
            bukti: '',
            jam_masuk : '',
        }

        setEdit(false);
        setForm(formValue);
        setShow(true);
    }

    const initTahunAjar = async () => {
        let data = await getTahunAjar();
        if(data.data != null){
            setTahunAjar(data.data);
        }else{
            swal("Error", data.message, "warning");
        }
    }

    const initRombel = async () => {
        let data = await getRombel();
        if(data.data != null){
            setRombel(data.data);
        }else{
            swal("Error", data.message, "warning");
        }
    }
   
    useEffect(() => {
        initTahunAjar();
        initRombel();
    },[]);

    const getData = async (id_rombel, bulan, id_ta_sm) => {
        
        let data = await detailRekapSiswa(id_rombel, bulan, id_ta_sm);
       
        if(data.data != null){
            setData(data.data.data);
        }else{
            swal("Error", data.message, "warning");
        }
    }

    const detailKehadirans = async (id) => {
        let res = await detailKehadiran(id);
        console.log('detail',res);
        if(res.status == 200){
            let formValue = {
                ...form,
                id: id,
                id_user: res.data.data.id_user,
                tgl_kehadiran: res.data.data.tgl_kehadiran,
                status_kehadiran: res.data.data.status_kehadiran,
                id_ta_sm : res.data.data.id_ta_sm,
                long : res.data.data.long,
                lat : res.data.data.lat,
                jam_masuk : res.data.data.jam_masuk,
                bukti : res.data.data.bukti_masuk,
            }
            console.log('form value',formValue);
            setForm(formValue);
        }else{
            
        }
        setShow(true);
    }

    const tambahKehadiran = async (id_user,tgl_kehadiran) => {
        let formValue = {
            ...form,
            id: null,
            id_user: id_user,
            tgl_kehadiran: tgl_kehadiran,
            id_ta_sm : id_ta_sm.current
        }

        setForm(formValue);
        setShow(true);
    }


    const validateForm  = Yup.object().shape({
        tahun_ajar: Yup.string()
          .required('Harus diisi'),
        rombel: Yup.string()
          .required('Harus diisi'),
        bulan: Yup.string()
          .required('Harus diisi'),
    });

    var tanggal = [];
    for (var i = 1; i <= 31; i++) {
        tanggal.push(<th key={i+1} scope="col">{i}</th>);
    } 

    const icon = (id,id_siswa,absensi,tgl_kehadiran) => {
        switch (absensi) {
            case 'hadir':
                return(
                    <HiBadgeCheck className="text-success" onClick={()=>{ id == null ? tambahKehadiran(id_siswa,tgl_kehadiran) : detailKehadirans(id) }}/>
                )
                break;
            case 'izin':
                return(
                    <HiExclamationCircle className="text-warning" onClick={()=>{ id == null ? tambahKehadiran(id_siswa,tgl_kehadiran) : detailKehadirans(id) }}/>
                )
                break;
            case 'sakit':
                return(
                    <HiMinusCircle className="text-warning" onClick={()=>{ id == null ? tambahKehadiran(id_siswa,tgl_kehadiran) : detailKehadirans(id) }}/>
                )
                break;
            case 'alpha':
                return(
                    <HiExclamation className="text-danger" onClick={()=>{ id == null ? tambahKehadiran(id_siswa,tgl_kehadiran) : detailKehadirans(id) }}/>
                )
                break
            default:
                return(
                    <HiMinusSm onClick={()=>{ id == null ? tambahKehadiran(id_siswa,tgl_kehadiran) : detailKehadirans(id) }}/>
                )
        }
    }


    return (
        <StyleRoot>
        <LayoutAdmin>
        <div>
            <div className="section-header">
                <h1>Detail Rekapan Siswa</h1>
                <div className="section-header-breadcrumb">
                    <div className="breadcrumb-item active">
                        <Link to="/">Dashboard</Link>
                    </div>
                    <div className="breadcrumb-item mx-1">
                        <Link to="/kehadiran/siswa">Kehadiran Siswa</Link>
                    </div>
                    <div className="breadcrumb-item"> Detail</div>
                </div>
            </div>

            <div className="">
                <div className="card">
                    <div className="card-body">
                        <div className="container-fluid">
                            <Formik
                            initialValues={{
                                tahun_ajar: '',
                                rombel: '',
                                bulan: '',
                            }}
                            onSubmit={async (values)=>{
                                id_ta_sm.current = values.tahun_ajar;
                                bulan_ref.current = values.bulan;
                                rombel_ref.current = values.rombel;
                                await getData(values.rombel, values.bulan, values.tahun_ajar);
                            }}
                            validationSchema={validateForm}
                            >
                            {({
                                isSubmitting,
                                errors,
                                onChange
                            }) => (
                            <Form>
                                <div className="d-flex clearfix flex-row-reverse">

                                    <div className="col-auto">
                                        <label className="form-label">&nbsp;</label><br></br>
                                        <ReactToPrint
                                            trigger={() => <button type="button"
                                            className="btn btn-danger">Download</button>}
                                            content={() => ref.current} 
                                        />
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

                                    <div className="col-3 mx-1">
                                        <label className="form-label">Tahun Ajaran</label>
                                        <Field name="tahun_ajar" as="select" className="form-select">
                                            <option value="">-- pilih --</option>
                                            {tahunAjar.map((result,key) => {
                                                return (
                                                    <option key={key} value={result.id}>{result.tahun_ajaran} {result.semester}</option>
                                                )
                                            })}
                                        </Field>
                                        <small className="text-danger">{errors.tahun_ajar}</small>
                                    </div>

                                    <div className="col-2 mx-1">
                                        <label className="form-label">Bulan</label>
                                        <Field name="bulan" as="select" className="form-select">
                                            <option value="">-- pilih --</option>
                                            <option value="1">Januari</option>
                                            <option value="2">Februari</option>
                                            <option value="3">Maret</option>
                                            <option value="4">April</option>
                                            <option value="5">Mei</option>
                                            <option value="6">Juni</option>
                                            <option value="7">Juli</option>
                                            <option value="8">Agustus</option>
                                            <option value="9">September</option>
                                            <option value="10">November</option>
                                            <option value="11">Oktober</option>
                                            <option value="12">Desember</option>
                                        </Field>
                                        <small className="text-danger">{errors.bulan}</small>
                                    </div>

                                    <div className="col-2 mx-1">
                                        <label className="form-label">Rombel</label>
                                        <Field name="rombel" as="select" className="form-select">
                                            <option value="">-- pilih --</option>
                                            {rombel.map((result,key) => {
                                                return (
                                                    <option key={key} data-name={result.nama} value={result.id}>{result.nama}</option>
                                                )
                                            })}
                                        </Field>
                                        <small className="text-danger">{errors.rombel}</small>
                                    </div> 

                                </div> 
                            </Form>
                            )}
                            </Formik>
                            

                            <div className="mt-3">
                                
                                <div className="table-responsive">
                                    <div style={style} ref={ref}>
                                        <div className="">
                                            <span className="mx-2"><HiBadgeCheck className="text-success"/> Hadir</span>
                                            <span className="mx-2"><HiExclamationCircle className="text-warning"/> Izin</span>
                                            <span className="mx-2"><HiMinusCircle className="text-warning"/> Sakit</span>
                                            <span className="mx-2"><HiExclamation className="text-danger"/> Alpha</span>
                                            <span className="mx-2"><HiMinusSm/> Libur</span>
                                        </div>
                                        <div>
                                            <table className="table">
                                                <thead className="thead-light">
                                                    <tr>
                                                    <th scope="col">No</th>
                                                    <th scope="col">Nama</th>
                                                    {tanggal}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                {data.length != 0 ? data.map((val, key) => {
                                                    return (
                                                        <tr key={key}>
                                                            <td>{key+1}</td>
                                                            <td>{val.nama}</td>
                                                            {
                                                                val.kehadiran.map((value, key) => {
                                                                    return(
                                                                        <td key={key}>{icon(value.id,val.id_siswa,value.absensi,value.tgl_absensi)}</td>
                                                                        // <td key={key}>{val.id_siswa}</td>
                                                                    )
                                                                })
                                                            }
                                                        </tr>
                                                    )
                                                }) : 'data kosong'}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                
                            </div>

                        </div>
                    </div>
                </div>
             
            </div>
        </div>

        </LayoutAdmin>

        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Jadwal Harian</Modal.Title>
            </Modal.Header>
            <Modal.Body>

                <Formik
                initialValues={form}
                onSubmit={ async (values, { setSubmitting }) => {
                    if(values.id === null){ //tambah baru
                        var req = await absenAdmin({
                            kehadirans : [ values ]
                        })
                    }else{
                        var req = await updateKehadiran(values)
                    }

                    if(req.status === 200){
                        swal("Sukses", req.data.message, "success");
                        await getData(rombel_ref.current, bulan_ref.current, id_ta_sm.current);
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
                        <label htmlFor="role">Status Kehadiran</label>
                        <Field name="status_kehadiran" as="select" id="status_kehadiran" className="form-select" >
                            <option value="">-- Pilih --</option>
                            <option value="hadir">Hadir</option>
                            <option value="izin">Izin</option>
                            <option value="sakit">Sakit</option>
                            <option value="alpha">Alpha</option>
                        </Field>
                        {errors.status_kehadiran && touched.status_kehadiran && errors.status_kehadiran}
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

                    <div className="form-row row mb-3">
                        <div className="col">
                            <label htmlFor="role">Laitude</label>
                            <input type="text" onChange={handleChange} onBlur={handleBlur} value={values.lat} className="form-control" disabled/>
                        </div>
                        <div className="col">
                            <label htmlFor="role">Longitude</label>
                            <input type="text" onChange={handleChange} onBlur={handleBlur} value={values.long} className="form-control" disabled/>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="role">Jam Masuk</label>
                        <input
                            type="text"
                            className="form-control" 
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.jam_masuk}
                            disabled
                        />
                        {errors.jam_masuk && touched.jam_masuk && errors.jam_masuk}
                    </div>

                    <div>
                        <img src={values.bukti && ''} className="w-100"/>
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

        </StyleRoot>
    )
}

export default RekapKehadiranSiswa