import React, {useState} from 'react'
import { Formik, Field, Form } from "formik";
import {login} from "../../api/auth";
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';
import { setId, setIdKelasSiswa, setIdSekolah, setTahun, setTahunAjar, setToken, setRole } from '../../auth/auth';
import "../../../css/style.css";
import "../../../css/custom.css";
import "../../../css/components.css";
import * as Yup from 'yup';

const Login = () => {
    const navigate = useNavigate();

    const validateForm  = Yup.object().shape({
        username: Yup.string()
          .required('Harus diisi'),
        password: Yup.string()
          .required('Harus diisi'),
        role: Yup.string()
          .required('Harus diisi'),
    });

  return (
    <div>
         <div id="app">
            <div className="section">
                <div className="container mt-5">
                    <div className="row">
                        <div className="col-12 col-sm-8 offset-sm-2 col-md-6 offset-md-3 col-lg-6 offset-lg-3 col-xl-4 offset-xl-4">      

                            <h3 className="text-center mb-4">Absensi</h3>

                            <div className="card card-success">
                                <div className="card-header">
                                    <h4 className="text-nu">Login </h4>
                                </div>

                                <div className="card-body">

                                <Formik
                                    initialValues={{ password: "", username: "", role: "", id_sekolah: 1 }}
                                    onSubmit={ async (values) => {
                                        let res = await login(values);   
                                        
                                        if(res.status){
                                            setId(res.data.id);
                                            setIdSekolah(res.data.id_sekolah);
                                            setToken(res.data.access_token);
                                            setTahunAjar(res.data.id_ta_aktif);
                                            setTahun(res.data.tahun);
                                            setRole(res.data.role);

                                            const parseJwt = (token) => {
                                                var base64Url = token.split('.')[1];
                                                var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                                                var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
                                                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                                                }).join(''));
                                            
                                                return JSON.parse(jsonPayload) ;
                                            };

                                            let parse = parseJwt(res.data.access_token);
                                            
                                            swal("Good job!", "Sukses", "success");

                                            if(res.data.role == 'admin-absensi'){
                                                navigate('/admin');
                                            }else if(res.data.role == 'siswa'){
                                                setIdKelasSiswa(res.data.id_kelas_siswa);
                                                navigate('/');
                                            }else{
                                                navigate('/');
                                            }
                                        }else{
                                            swal("Error", res.message, "warning");
                                        }

                                    }}
                                    validationSchema={validateForm}
                                >
                                    {({ isSubmitting, errors }) => (
                                    <Form>

                                        <div className="form-group">
                                            <label htmlFor="email">Email</label>
                                            <Field id="email" type="text" className="form-control" name="username"
                                                required /> 
                                            <small className="text-danger">{errors.email}</small>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="password">Password</label>
                                            <Field id="password" type="password" className="form-control" name="password"
                                                required/> 
                                            <small className="text-danger">{errors.password}</small>
                                        </div> 

                                        <div className="form-group">
                                            <label htmlFor="role">Role</label>
                                            <Field name="role" as="select" id="role" className="form-select">
                                                <option value="">-- Pilih --</option>
                                                <option value="admin-absensi">Admin</option>
                                                <option value="guru">Guru</option>
                                                <option value="siswa">Siswa</option>
                                            </Field>
                                            <small className="text-danger">{errors.role}</small>
                                        </div>

                                        <div className="form-group">
                                            <button type="submit" className="btn btn-nu btn-lg btn-block" disabled={isSubmitting}>
                                                { isSubmitting ? 
                                                <>
                                                <span class="spinner-border spinner-border-sm mr-1" role="status" aria-hidden="true"></span>
                                                <span class="sr-only">Loading...</span>
                                                </>
                                                 : 'Login'}
                                            </button>
                                        </div>

                                    </Form>
                                    )}
                                </Formik>

                                </div>

                            </div>
                                    
                                    
                            <div className="simple-footer">
                                Copyright &copy; Dev
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
        
    </div>
  )
}

export default Login