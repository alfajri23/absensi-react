import React, {useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import {HiOutlinePencilAlt , HiOutlineTrash, HiOutlinePlusCircle} from 'react-icons/hi';
import { AiOutlineCloudSync } from 'react-icons/ai';
import Modal from 'react-bootstrap/Modal';
import { Formik, Field } from 'formik';
import { getIzinGuru, confirm, destroy, detail, updates } from '../../api/izin/api_izin'
import swal from 'sweetalert';
import * as Yup from 'yup';

import LayoutAdmin from '../../layouts/admin';
import { getTahun } from '../../auth/auth';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Table from '../../components/table/react-table';


const IzinGuru = () => {

    let [data, setData] = useState([]);
    
    let formValue = {
        id: '',
        nama: '',
        kode: '',
        tgl_libur: '',
        keterangan: ''
    }

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => {
        formValue = {
            id: '',
            nama: '',
            kode: '',
            tgl_libur: '',
            keterangan: '',
        }

        setEdit(false);
        setForm(formValue);
        setShow(true);
    }

   
    useEffect(() => {
        getData(new Date().getMonth() + 1,new Date().getFullYear());
    },[]);

    const getData = async (mount,year) => {
        let data = await getIzinGuru(mount,year);
        if(data.data != null){
            setData(data.data);
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
            console.log(res.data.data);

            formValue ={
                ...formValue,
                id: res.data.data.id,
                nama: res.data.data.nama,
                kode: res.data.data.kode,
                tgl_libur: res.data.data.tgl_libur,
                keterangan: res.data.data.keterangan
            }

            setEdit(true);
            setForm(formValue);
            setShow(true);
        }else{
            swal("Error", res.message, "warning");
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

    const confirms = async (id,action) => {
        let konfirm = {
            id: id,
            konfirmasi: action
        };

        let res = await confirm(konfirm);

        if(res.status == 200){
            getData(new Date().getMonth() + 1,new Date().getFullYear());
            swal("Good job!", "Sukses", "success");
        }else{
            swal("Error", res.message, "warning");
        }
    } 

    const columnFormat = {
        action: ({ value, row }) => {
            switch(value) {
                case 0:
                    return(
                        <DropdownButton
                            key={row.original.id}
                            id="dropdown-button-dark-example2"
                            variant="warning"
                            // menuVariant="dark"
                            title="Konfirmasi"
                            className=""
                            size="sm"
                        >
                            <Dropdown.Item as="button" onClick={()=>confirms(row.original.id,1)} active>
                            Terima
                            </Dropdown.Item>
                            <Dropdown.Item as="button" onClick={()=>confirms(row.original.id,2)}>
                                Tolak
                            </Dropdown.Item>
                            
                        </DropdownButton>
                    )
                  break;
                case 1:
                  return(<span className="badge text-bg-success">Diterima</span>)
                  break;
                default:
                    return(<span className="badge text-bg-danger">Ditolak</span>)
            }

           
        },
        bukti: ({value, row}) => {
            if(value != null) {
                return(
                    <a href={value} target="_blank">Lihat bukti</a>
                );
            }else{
                return("tidak ada bukti");
            }
           
        },
    }

    const column = [
        {
            accessor: 'tgl_kehadiran',
            Header: 'Tanggal',
        },
        {
            accessor: 'nama',
            Header: 'nama',
        },
        {
            accessor: 'status_kehadiran',
            Header: 'Ketidakhadiran',
        },
        {
            accessor: 'bukti',
            Header: 'Bukti',
            Cell: columnFormat.bukti
        },
        {
            accessor: 'konfirmasi',
            Header: 'Aksi',
            Cell: columnFormat.action
        },
    ]

    const validateForm  = Yup.object().shape({
        bulan: Yup.string()
          .required('Harus diisi'),
        tahun: Yup.string()
          .required('Harus diisi'),
    });


    return (
        <LayoutAdmin>
        <div>
            <div className="section-header">
                <h1>Izin Guru</h1>
                <div className="section-header-breadcrumb">
                    <div className="breadcrumb-item active">
                        <Link to="/admin">Dashboard</Link>
                    </div>
                    <div className="breadcrumb-item">Izin Guru</div>
                </div>
            </div>

            <div className="section-header">
                <Link to="/izin/siswa" className="btn btn-light mx-1">Siswa</Link>
                <Link to="/izin/guru" className="btn btn-primary mx-1">Guru</Link>
            </div>

            <div className="">
                <div className="card">
                    <div className="card-body">
                        <div className="container-fluid">
                            
                            <Formik
                            initialValues={{
                                bulan: '',
                                tahun: '',
                            }}
                            onSubmit={async (values, { setSubmitting })=>{
                                await getData(values.bulan, values.tahun);
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
                                <div className="d-flex">
                                    
                                    <div className="col-2 mx-1">
                                        <label className="form-label">Tahun</label>
                                        <Field name="tahun" as="select" className="form-select">
                                            <option value="">-- pilih --</option>
                                            {tahun().map((result,key) => {
                                                return (
                                                    <option key={key} value={result}>{result}</option>
                                                )
                                            })}
                                        </Field>
                                        <small className="text-danger">{errors.tahun}</small>
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
                                            <option value="10">Oktober</option>
                                            <option value="11">November</option>
                                            <option value="12">Desember</option>
                                        </Field>
                                        <small className="text-danger">{errors.bulan}</small>
                                    </div>

                                    <div className="col-auto mx-1">
                                        <label className="form-label">&nbsp;</label><br></br>
                                        <button type="submit" className="btn btn-nu btn-block" disabled={isSubmitting}>
                                            { isSubmitting ? 
                                                <>
                                                <span className="spinner-border spinner-border-sm mr-1" role="status" aria-hidden="true"></span>
                                                <span className="sr-only">Loading...</span>
                                                </>
                                            : 'Cari'}
                                        </button>
                                    </div>
                                </div> 
                            </form>
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

        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Detail Izin Siswa</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                    
             
            </Modal.Body>

        </Modal>


        </LayoutAdmin>
    )
}

export default IzinGuru
