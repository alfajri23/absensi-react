import React from 'react'
import { Formik, Field, Form } from "formik";
import {login} from "../../api/auth";
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';
import { setId, setIdSekolah, setToken } from '../../auth/auth';

const Login = () => {
    const navigate = useNavigate();

  return (
    <div>
         <div id="app">
            <div className="section">
                <div className="container mt-5">
                    <div className="row">
                        <div className="col-12 col-sm-8 offset-sm-2 col-md-6 offset-md-3 col-lg-6 offset-lg-3 col-xl-4 offset-xl-4">
                            
                            <div className="login-brand mt-0">
                                <img src="" alt="logo" width="250"
                                    className="rounded-circle"/>
                            </div>

                            <div className="card card-success">
                                <div className="card-header">
                                    <h4 className="text-nu">Login</h4>
                                </div>

                                <div className="card-body">

                                <Formik
                                    initialValues={{ password: "", username: "", role: "", id_sekolah: 1 }}
                                    onSubmit={ async (values) => {
                                        let res = await login(values);   
                                        console.log(res)

                                        if(res.status){
                                            // localStorage.setItem('id',res.data.id);
                                            // localStorage.setItem('id_sekolah',res.data.id_sekolah);
                                            // localStorage.setItem('access_token',res.data.access_token);
                                            
                                            setId(res.data.id);
                                            setIdSekolah(res.data.id_sekolah);
                                            setToken(res.data.access_token);

                                            const parseJwt = (token) => {
                                                var base64Url = token.split('.')[1];
                                                var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                                                var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
                                                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                                                }).join(''));
                                            
                                                return JSON.parse(jsonPayload) ;
                                            };

                                            let parse = parseJwt(res.data.access_token);
                                            console.log(parse);
                                            
                                            swal("Good job!", "Sukses", "success");
                                            navigate('/');
                                        }else{
                                            swal("Error", res.message, "warning");
                                        }

                                    }}
                                >
                                    <Form>

                                        <div className="form-group">
                                            <label htmlFor="email">Email</label>
                                            <Field id="email" type="email" className="form-control" name="username"
                                                required /> 
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="password">Password</label>
                                            <Field id="password" type="password" className="form-control" name="password"
                                                required/> 
                                        </div> 

                                        <div className="form-group">
                                            <label htmlFor="role">Role</label>
                                            <Field name="role" as="select" id="role" className="form-select">
                                                <option value="">-- Pilih --</option>
                                                <option value="admin-absensi">Admin</option>
                                                <option value="guru">guru</option>
                                                <option value="siswa">siswa</option>
                                            </Field>
                                        </div>

                                        <div className="form-group">
                                            <button type="submit" className="btn btn-nu btn-lg btn-block" id="btnLogin"
                                            >
                                                Login
                                            </button>
                                        </div>

                                    </Form>
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