import React, {useEffect, useState} from 'react';
import { Formik, Field } from 'formik';
import { getAll as getTahunAjar } from '../../api/api_tahunajar';
import LayoutAdmin from '../../layouts/admin';
import { Link } from 'react-router-dom';
import swal from 'sweetalert'; 
import * as Yup from 'yup';
import { resetDataAbsensi } from '../../api/rekap/kehadiran/api_kehadiran';

const Reset = () => {

    let [tahunAjar, setTahunAjar] = useState([]);

    const initTahunAjar = async () => {
        let data = await getTahunAjar();
        console.log(data);
        if(data.data != null){
            setTahunAjar(data.data);
        }else{
            swal("Error", data.message, "warning");
        }
    }

    const resetData = async (id) => {
        swal({
            title: "Hapus ?",
            text: "Yakin untuk menghapus ini ?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
        .then(async (willDelete) => {
            if (willDelete) {
                let res = await resetDataAbsensi(id);
                console.log(res)
                if(res.status == 200){
                    swal("Sukses", res.message, "warning");
                }else{
                    swal("Error", res.message, "warning");
                }
            } else {
              swal("Data aman");
            }
        }); 

        
    }

    useEffect(() => {
        initTahunAjar();
    },[]);

    const validateForm  = Yup.object().shape({
        tahun_ajar: Yup.string()
          .required('Harus diisi'),
    });

  return (
    <LayoutAdmin>
        <div>
            <div className="section-header">
                <h1>Reset data presensi</h1>
                <div className="section-header-breadcrumb">
                    <div className="breadcrumb-item active">
                        <Link to="/admin">Dashboard</Link>
                    </div>
                    <div className="breadcrumb-item">Reset data</div>
                </div>
            </div>

            <div className="row">
                <div className="card">
                    <div className="card-body">
                        <div className="container-fluid">
                            <h6>Reset data</h6>
                            <p>Dengan mereset data ini maka data presensi akan hilang<br></br>
                            Anda tidak dapat melihat detail data presensi namun data rekap akan tetap disimpan</p>

                            <Formik
                            initialValues={{
                                tahun_ajar: '',
                            }}
                            onSubmit={async (values, { setSubmitting })=>{
                                await resetData(values.tahun_ajar);
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
                            }) => (
                            <form onSubmit={handleSubmit}>
                                <div className="d-flex my-2">
                                    
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

                                    <div className="col-auto mx-1">
                                        <label className="form-label">&nbsp;</label><br></br>
                                        <button type="submit" className="btn btn-danger btn-block" disabled={isSubmitting}>
                                            { isSubmitting ? 
                                                <>
                                                <span className="spinner-border spinner-border-sm mr-1" role="status" aria-hidden="true"></span>
                                                <span className="sr-only">Loading...</span>
                                                </>
                                            : 'Hapus'}
                                        </button>
                                    </div>
                                </div> 
                            </form>
                            )}

                        </Formik>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </LayoutAdmin>
  )
}

export default Reset