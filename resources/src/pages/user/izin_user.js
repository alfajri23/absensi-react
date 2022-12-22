import React, { useEffect,useState } from 'react'
import { Link } from 'react-router-dom';
import {HiInformationCircle} from 'react-icons/hi';
import LayoutUser from '../../layouts/user';
import { Formik, Field } from 'formik';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import swal from 'sweetalert';
import { getId, getIdSekolah, getRole, getTahun, getTahunAjar } from '../../auth/auth';
import { getIzin, detail } from '../../api/izin/api_izin';
import Table from '../../components/table/react-table';
import * as Yup from 'yup';
import { create as storeIzin } from '../../api/izin/api_izin';

const RekapIzinUser = () => {

  let [data, setData] = useState([]);
  let [form, setForm] = useState(
    { 
        alasan: "", 
        tanggal: "", 
        keterangan: "", 
        file: ""
    });

  useEffect(() => {
    getData(new Date().getMonth() + 1,new Date().getFullYear());
  },[]);

  const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => {
        let formValue = {
            alasan: '',
            keterangan: '',
            id: '',
            tanggal: '',
            file: ''
        }

        setForm(formValue);
        setShow(true);
    }


  const tahun = () => {
    let tahun = getTahun() - 5;
    let list_tahun = [];
    for (let i = 0; i < 10; i++) {
        list_tahun.push(tahun++)
    }
    return list_tahun;
  }

  const getData = async (mount,year) => {
    let data = await getIzin(getId(),getRole(),mount,year);
    if(data.data != null){
        console.log(data.data)
        setData(data.data);
    }else{
        swal("Error", data.message, "warning");
    }
  }

  const detailData = async (id) => {
    let res = await detail(id, getRole());

    if(res.status == 200){
        let formValue = {
            id: res.data.data.id,
            keterangan: res.data.data.keterangan,
            alasan: res.data.data.status_kehadiran,
            tanggal: res.data.data.tgl_kehadiran,
            long: res.data.data.long,
            lat: res.data.data.lat,
            file: ''
        }

        setForm(formValue);
        setShow(true);
    }else{
        swal("Error", res.message, "warning");
    }

}

  const columnFormat = {
    date: ({value, row}) => {
        let date = new Date(value);
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('id', options)
    },
    status: ({value, row}) => {
      switch(value) {
          case 0:
            return(<span className="badge text-bg-secondary">Pending</span>)
            break;
          case 1:
            return(<span className="badge text-bg-success">Diterima</span>)
            break;
          default:
            return(<span className="badge text-bg-danger">Ditolak</span>)
      }
    },
    action: ({value, row}) => {
        if(row.original.konfirmasi == 0){
            return(
                <button onClick={()=> detailData(row.original.id)
                } type="button" className="btn btn-sm btn-outline-primary">
                    <HiInformationCircle className="fs-6" />
                </button>
            );
        }
    }
  }

  const column = [
      {
          accessor: 'id',
          Header: 'Id',
      },
      {
          accessor: 'tgl_kehadiran',
          Header: 'Tanggal',
          Cell: columnFormat.date
      },
      {
          accessor: 'keterangan',
          Header: 'Keterangan',
      },
      {
          accessor: 'status_kehadiran',
          Header: 'Ketidakhadiran',
      },
      {
          accessor: 'konfirmasi',
          Header: 'Status',
          Cell: columnFormat.status
      },
      {
        accessor: '',
        Header: 'Action',
        Cell: columnFormat.action
        },
  ];

  const validateForm  = Yup.object().shape({
    keterangan: Yup.string()
      .required('Harus diisi'),
    tanggal: Yup.string()
      .required('Harus diisi'),
  });

  const validateFilter  = Yup.object().shape({
    bulan: Yup.string()
      .required('Harus diisi'),
    tahun: Yup.string()
      .required('Harus diisi'),
  });

  return (
    <LayoutUser>
      <div className="p-0 p-sm-5">
        <section className="section">
          <div>
              <div className="pt-4">
                  <h1>Izin Siswa</h1>
              </div>

              <div className="section-header">
                  <Link to="/izin" className="btn btn-primary mx-1">Izin</Link>
                  <Link to="/kehadiran" className="btn btn-light mx-1">Kehadiran</Link>
              </div>

              <div className="">
                  <div className="card">
                      <div className="card-body p-sm-3 p-1">
                          <div className="container-fluid">
                              
                              <Formik
                              initialValues={{
                                  bulan: '',
                                  tahun: '',
                              }}
                              onSubmit={async (values, { setSubmitting })=>{
                                  await getData(values.bulan, values.tahun);
                              }}
                              validationSchema={validateFilter}
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
                                      
                                      <div className="col-sm-2 col-5">
                                          <label className="form-label">Tahun</label>
                                          <Field name="tahun" as="select" className="form-select" required>
                                              <option value="">-- pilih --</option>
                                              {tahun().map((result,key) => {
                                                  return (
                                                      <option key={key} value={result}>{result}</option>
                                                  )
                                              })}
                                          </Field>
                                      </div> 

                                      <div className="col-sm-2 col-4 mx-1">
                                          <label className="form-label">Bulan</label>
                                          <Field name="bulan" as="select" className="form-select" required>
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
                                      </div>

                                      <div className="col-auto mx-1">
                                          <label className="form-label">&nbsp;</label><br></br>
                                          <Button type="submit" className="btn btn-success w-100" disabled={isSubmitting}>
                                              { isSubmitting ? 
                                              <>
                                              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                              </>
                                                : 'Cari'}
                                          </Button>
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
        </section>
      </div>

      <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
            <Modal.Title>Izin</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Formik
                initialValues={form}
                onSubmit={ async (values) => {

                    const formData = new FormData();
                    formData.append('id_ta_sm', getTahunAjar());
                    formData.append('long', values.long);
                    formData.append('lat', values.lat);
                    formData.append('id_sekolah', getIdSekolah());
                    formData.append('keterangan', values.keterangan);
                    formData.append('status_kehadiran', values.alasan);
                    formData.append('tgl_kehadiran', values.tanggal);
                    formData.append('file', values.file);
                    formData.append('id', values.id);

                    let res = await storeIzin(formData);

                    if(res.status == 200){
                        handleClose();
                        swal("Good job!", "Sukses", "success");
                        getData(new Date().getMonth() + 1,new Date().getFullYear());
                        
                    }else{
                        swal("Error", res.message, "warning");
                    }
                    
                }}
                validationSchema={validateForm}
            >
                {({ 
                isSubmitting,
                handleBlur,
                setFieldValue,
                errors,
                handleSubmit,
                touched
                }) => (
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="email">Alasan</label>
                            <Field as="select" className="form-select" name="alasan">
                            <option value="">-- pilih --</option>
                            <option value="sakit">Sakit</option>
                            <option value="izin">Izin</option>
                            </Field> 
                            {errors.alasan && touched.alasan && errors.alasan}
                        </div>

                        <div className="form-group">
                            <label htmlFor="date">Tanggal</label>
                            <Field type="date" className="form-control" name="tanggal"
                                required /> 
                            {errors.tanggal && touched.tanggal && errors.tanggal}
                        </div>

                        <div className="form-group">
                            <label htmlFor="keterangan">Keterangan</label>
                            <Field as="textarea" type="text" className="form-control" name="keterangan"
                            style={{height: '120px'}}  required /> 
                            {errors.keterangan && touched.keterangan && errors.keterangan}
                        </div>

                        <div className="form-group">
                            <label htmlFor="file">File</label>
                            <input
                            type="file" 
                            className="form-control" 
                            name="file"
                            onBlur={handleBlur}
                            onChange={(event) => {
                                setFieldValue("file", event.currentTarget.files[0]);
                                //setFile(event.currentTarget.files[0]);
                            }}
                            /> 
                            {errors.file && touched.file && errors.file}
                        </div>

                        <div className="form-group">
                            <Row>
                            <Col>
                                <Button className="btn-block w-100" variant="outline-dark" onClick={handleClose}>
                                Close
                                </Button>
                            </Col>
                            <Col>
                                <Button type="submit" className="btn btn-success w-100" disabled={isSubmitting}>
                                    { isSubmitting ? 
                                    <>
                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    <span className="sr-only">Loading...</span>
                                    </>
                                    : 'Izin'}
                                </Button>
                            </Col>
                            </Row>
                        </div>
                    </form>
                )}
                
            </Formik>
            </Modal.Body>
        </Modal>
        
    </LayoutUser>
  )
}

export default RekapIzinUser