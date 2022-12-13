import React, {useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import { Formik, Field, Form } from 'formik';
import { getAll as getTahunAjar } from '../../../api/api_tahunajar';
import { getAll as getRombel } from '../../../api/api_rombel';
import swal from 'sweetalert'; 
import * as Yup from 'yup';

import LayoutAdmin from '../../../layouts/admin';
import { rekapSiswa } from '../../../api/rekap/kehadiran/api_kehadiran';
import Table from '../../../components/table/react-table';
import ReactToPrint from 'react-to-print';
import { StyleRoot } from 'radium';

const ref = React.createRef();

const KehadiranSiswa = () => {

    let [data, setData] = useState([]);
    let [tahunAjar, setTahunAjar] = useState([]);
    let [rombel, setRombel] = useState([]);

    const notPrint = {
        '@media print' : {
            display: 'none',
        },
    };

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

    const getData = async (id_rombel, id_ta_sm) => {
        let data = await rekapSiswa(id_rombel, id_ta_sm);
       
        if(data.data != null){
            setData(data.data.data);
        }else{
            swal("Error", data.message, "warning");
        }
    }

    const columnFormat = {
       
    }

    let index = 0;
    const column = [
        {
            Header: 'No',
            //accessor: '',
            Cell: ({}) => {
                return index++;
            },
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
    });


    return (
        <StyleRoot>
        <LayoutAdmin>
            <div>
                <div className="section-header">
                    <h1>Kehadiran</h1>
                    <div className="section-header-breadcrumb">
                        <div className="breadcrumb-item active">
                            <Link to="/admin">Dashboard</Link>
                        </div>
                        <div className="breadcrumb-item mx-1"> Kehadiran Siswa</div>
                    </div>
                </div>

                <div className="section-header">
                    <Link to="/kehadiran/siswa" className="btn btn-primary mx-1">Siswa</Link>
                    <Link to="/kehadiran/guru" className="btn btn-light mx-1">Guru</Link>
                </div>

                <div className="mb-2 clearfix">
                    <Link to="/kehadiran/rekap-siswa" className="btn btn-danger btn-sm btn-block float-end">
                        Detail Rekapan
                    </Link>
                </div>

                <div className="row">
                    <div className="card">
                        <div className="card-body" ref={ref}>
                            <div className="container-fluid">
                                
                                <Formik
                                initialValues={{
                                    tahun_ajar: '',
                                    rombel: '',
                                }}
                                onSubmit={async (values)=>{
                                    await getData(values.rombel, values.tahun_ajar);
                                }}
                                validationSchema={validateForm}
                                >
                                {({
                                    isSubmitting,
                                    errors,
                                }) => (
                                <Form>
                                    <div className="d-flex" style={notPrint}>
                                        
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
                                            <ReactToPrint
                                                trigger={() => <button type="button"
                                                className="btn btn-danger">Download</button>}
                                                content={() => ref.current} 
                                            />
                                        </div>

                                    </div> 
                                </Form>
                                )}

                                </Formik>
                                

                                <div className="mt-n1">
                                    <Table datas={data} column={column} columnFormats={columnFormat}/>
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

export default KehadiranSiswa