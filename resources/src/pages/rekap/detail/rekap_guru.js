import React, {useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import { Formik, Field, Form } from 'formik';
import { getAll as getTahunAjar } from '../../../api/api_tahunajar';
import { getAll as getRombel } from '../../../api/api_rombel';
import swal from 'sweetalert'; 
import Radium, { StyleRoot } from 'radium';
import * as Yup from 'yup';

import LayoutAdmin from '../../../layouts/admin';
import { detailRekapGuru, detailRekapSiswa } from '../../../api/rekap/kehadiran/api_kehadiran';
import ReactToPrint from 'react-to-print';
const ref = React.createRef();

const RekapKehadiranGuru = () => {

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

    const initTahunAjar = async () => {
        let data = await getTahunAjar();
        if(data.data != null){
            setTahunAjar(data.data);
        }else{
            swal("Error", data.message, "warning");
        }
    }
   
    useEffect(() => {
        initTahunAjar();
    },[]);

    const getData = async (bulan, id_ta_sm) => {
        
        let data = await detailRekapGuru(bulan, id_ta_sm);
        console.log(data.data.data)
        if(data.data != null){
            setData(data.data.data);
        }else{
            swal("Error", data.message, "warning");
        }
    }

    const validateForm  = Yup.object().shape({
        tahun_ajar: Yup.string()
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
                        <Link to="/kehadiran/guru">Kehadiran Guru</Link>
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
                                bulan: '',
                            }}
                            onSubmit={async (values)=>{
                                await getData(values.bulan, values.tahun_ajar);
                            }}
                            validationSchema={validateForm}
                            >
                            {({
                                isSubmitting,
                                errors,
                            }) => (
                            <Form>
                                <div className="d-flex flex-row-reverse">

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
                                        <div>{errors.tahun_ajar}</div>
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
                                        <div>{errors.bulan}</div>
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

export default RekapKehadiranGuru