import React, {useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import { Formik, Field, Form } from 'formik';
import { getAll as getTahunAjar } from '../../../api/api_tahunajar';
import { getAll as getRombel } from '../../../api/api_rombel';
import swal from 'sweetalert'; 
import Radium, { StyleRoot } from 'radium';
import * as Yup from 'yup';

import LayoutAdmin from '../../../layouts/admin';
import { detailRekapSiswa } from '../../../api/rekap/kehadiran/api_kehadiran';
import ReactToPrint from 'react-to-print';

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

    let [data, setData] = useState([]);
    let [tahunAjar, setTahunAjar] = useState([]);
    let [rombel, setRombel] = useState([]);

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

    const columnFormat = {
       
    }

    const column = [
        {
            Header: 'No',
            accessor: 'Id',
        },
        {
            Header: 'Nama',
            accessor: 'nama',
        },
        {
            Header: 'NIS',
            accessor: 'nis',
        },
        {
            Header: 'Hadir',
            accessor: 'hadir',
        },
        {
            Header: 'Izin',
            accessor: 'izin',
        },
        {
            Header: 'Sakit',
            accessor: 'sakit',
        },
        {
            Header: 'Alpha',
            accessor: 'alpha',
        },
    ]

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
                                    <div>
                                        <table className="table" style={style} ref={ref}>
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
                                                        <td>{val.id}</td>
                                                        <td>{val.nama}</td>
                                                        {
                                                            val.kehadiran.map((val, key) => {
                                                                return(
                                                                    <td>{val.absensi}</td>
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

        </LayoutAdmin>
        </StyleRoot>
    )
}

export default RekapKehadiranSiswa