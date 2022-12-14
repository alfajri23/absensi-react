import React, { useEffect,useState } from 'react'
import { Link } from 'react-router-dom'
import LayoutUser from '../../layouts/user';
import { Formik, Field } from 'formik';
import swal from 'sweetalert';
import { getId, getRole, getTahun } from '../../auth/auth';
import Table from '../../components/table/react-table';
import Button from 'react-bootstrap/Button';
import * as Yup from 'yup';
import { getKehadiran } from '../../api/rekap/kehadiran/api_kehadiran';

const RekapKehadiranUser = () => {

  let [data, setData] = useState([]);

  useEffect(() => {
    getData(new Date().getMonth() + 1,new Date().getFullYear());
  },[]);

  const tahun = () => {
    let tahun = getTahun() - 5;
    let list_tahun = [];
    for (let i = 0; i < 10; i++) {
        list_tahun.push(tahun++)
    }
    return list_tahun;
  }

  const getData = async (mount,year) => {
    let data = await getKehadiran(getId(),getRole(),mount,year);
    if(data.data != null){
        setData(data.data);
    }else{
        swal("Error", data.message, "warning");
    }
  }

  const columnFormat = {
    date: ({value, row}) => {
        let date = new Date(value);
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('id', options)
    },
    action: ({value, row}) => {
        switch(value) {
            case 'izin':
              return(<span className="badge text-bg-secondary">Izin</span>)
              break;
            case 'hadir':
              return(<span className="badge text-bg-success">Hadir</span>)
              break;
            default:
              return(<span className="badge text-bg-danger">Sakit</span>)
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
          accessor: 'status_kehadiran',
          Header: 'Status Kehadiran',
          Cell: columnFormat.action
      },
      {
          accessor: 'jam_masuk',
          Header: 'Jam Masuk',
      },
  ];

  const validateForm  = Yup.object().shape({
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
                  <h1>Kehadiran Siswa</h1>
              </div>

              <div className="section-header">
                  <Link to="/izin" className="btn btn-light mx-1">Izin</Link>
                  <Link to="/kehadiran" className="btn btn-primary mx-1">Kehadiran</Link>
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


        
    </LayoutUser>
  )
}

export default RekapKehadiranUser