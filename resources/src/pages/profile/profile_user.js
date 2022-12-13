import { Field, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react'
import { getProfile, updateProfile, changePassword  } from '../../api/profile/api_profile';
import LayoutAdmin from '../../layouts/admin';
import swal from 'sweetalert'; 
import * as Yup from 'yup';
import { getIdSekolah } from '../../auth/auth';
import { Button } from 'react-bootstrap';
import LayoutUser from '../../layouts/user';

const ProfileUser = () => {

    let [data, setData] = useState({
    });

    useEffect(() => {
        getData();
    },[]);

    const getData = async () => {
        let data = await getProfile();
        console.log(data.data);

        if(data.data != null){
            let datas = {
                nama: data.data.nama,
                email: data.data.email,
            }
            setData(data.data);
        }else{
            swal("Error", data.message, "warning");
        }
    }

    const validateForm  = Yup.object().shape({
        nama: Yup.string()
          .required('Harus diisi'),
        email: Yup.string().email('Invalid email')
          .required('Harus diisi'),
    });

    const validateFormPassword  = Yup.object().shape({
        current_password: Yup.string()
          .required('Harus diisi'),
        new_password: Yup.string()
          .required('Harus diisi'),
        confirm_password: Yup.string()
          .required('Harus diisi'),
    });


  return (
    <LayoutUser>
        <div className="p-2 p-sm-5">
            <section className="section">
                <div className="py-3">
                    <h1>Profile</h1>
                </div>
                
                <div className="section-body">
                        <div className="row mt-sm-4">

                            <div className="col-12 col-sm-6">
                                <div className="row">
                                    <div className="col-12 col-md-12">
                                        <div className="card profile-widget">
                                            <div className="profile-widget-header">
                                                <img alt="image"
                                                    src={data.file}
                                                    className="rounded-circle profile-widget-picture"/>
                                                <div className="profile-widget-items">
                                                    
                                                    <div className="profile-widget-item">
                                                        <div className="profile-widget-item-label fw-bold">
                                                            <h5>{data.nama}</h5>
                                                            
                                                            </div>
                                                        <div className="profile-widget-item-value"></div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="profile-widget-description">
                                                <div className="profile-widget-item-label mt-3">Email</div>
                                                <div className="profile-widget-item-value fw-bold">{data.email}</div>

                                                <div className="profile-widget-item-label mt-3">Telepon</div>
                                                <div className="profile-widget-item-value fw-bold">{data.telepon}</div>

                                                <div className="profile-widget-item-label mt-3">Alamat</div>
                                                <div className="profile-widget-item-value fw-bold">{data.alamat}</div>

                                                
                                            </div>
                                            
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-12 col-sm-6">
                                <div className="row">
                                    <div className="col-12 col-md-12">
                                        <div className="card">
                                            <div className="card-header">
                                                <h4>Edit Profile</h4>
                                            </div>
                                            <div className="card-body">
                                                <div className="row">
                                                <Formik
                                                    initialValues={data}
                                                    enableReinitialize={true}
                                                    onSubmit={ async (values, { setSubmitting }) => { 
                                                        let req = {
                                                            nama: values.nama,
                                                            email: values.email,
                                                            id_sekolah: getIdSekolah()
                                                        }
                                                        let res = await updateProfile(req);
                                                        
                                                        if(res.status == 200){
                                                            getData();
                                                            swal("Good job!", "Sukses", "success");
                                                        }else{
                                                            swal("Error", res.message, "warning");
                                                        }
                                    
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
                                                    isValidating
                                                    /* and other goodies */
                                                }) => (
                                                <Form>
                                                    <div className="form-group">
                                                        <label htmlFor="role">Nama</label>
                                                        <Field
                                                            type="text"
                                                            name="nama"
                                                            className="form-control" 
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            value={values.nama}
                                                            required
                                                        />
                                                        {errors.nama && touched.nama && errors.nama}
                                                    </div>

                                                    <div className="form-group">
                                                        <label htmlFor="role">email</label>
                                                        <Field
                                                            type="email"
                                                            name="email"
                                                            className="form-control" 
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            value={values.email}
                                                            required
                                                        />
                                                        {errors.email && touched.email && errors.email}
                                                    </div>

                                                    <Button type="submit" className="btn btn-nu btn-lg btn-block" disabled={isSubmitting}>
                                                    { isSubmitting ? 
                                                    <>
                                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                    </>
                                                        : 'Update'}
                                                    </Button>
                                                </Form>
                                                )}
                                                </Formik>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-12 col-md-12">
                                        <div className="card">
                                            <div className="card-header">
                                                <h4>Reset password</h4>
                                            </div>
                                            <div className="card-body">
                                                <div className="row">
                                                    <Formik
                                                        initialValues={{
                                                            current_password: '',
                                                            new_password: '',
                                                            confirm_password: '',
                                                            
                                                        }}
                                                        onSubmit={ async (values, { setSubmitting }) => {
                                                            
                                                            let req = {
                                                                ...values,
                                                                id_sekolah: getIdSekolah()
                                                            }

                                                            let res = await changePassword(req);
                                                            
                                                            if(res.status == 200){
                                                                getData();
                                                                swal("Good job!", "Sukses mengganti password", "success");
                                                                setSubmitting(false)
                                                            }else{
                                                                console.log(res)
                                                                swal("Error", res.message, "warning");
                                                            }
                                        
                                                        }}
                                                        validationSchema={validateFormPassword}
                                                    >
                                                        {({
                                                    values,
                                                    errors,
                                                    touched,
                                                    handleChange,
                                                    handleBlur,
                                                    handleSubmit,
                                                    isSubmitting,
                                                    isValidating
                                                    /* and other goodies */
                                                }) => (
                                                    <Form>
                                                        <div className="form-group">
                                                            <label htmlFor="role">Password Lama</label>
                                                            <Field
                                                                type="password"
                                                                name="current_password"
                                                                className="form-control" 
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                value={values.current_password}
                                                                required
                                                            />
                                                            {errors.current_password && touched.current_password && errors.current_password}
                                                        </div>

                                                        <div className="form-group">
                                                            <label htmlFor="role">Password Baru</label>
                                                            <Field
                                                                type="password"
                                                                name="new_password"
                                                                className="form-control" 
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                value={values.new_password}

                                                                required
                                                            />
                                                            {errors.new_password && touched.new_password && errors.new_password}
                                                        </div>

                                                        <div className="form-group">
                                                            <label htmlFor="role">Ulangi Password Baru</label>
                                                            <Field
                                                                type="password"
                                                                name="confirm_password"
                                                                className="form-control" 
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                value={values.confirm_password}

                                                                required
                                                            />
                                                            {errors.confirm_password && touched.confirm_password && errors.confirm_password}
                                                        </div>

                                                        <Button type="submit" className="btn btn-warning btn-lg btn-block" disabled={isSubmitting}>
                                                        { isSubmitting ? 
                                                        <>
                                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                        </>
                                                            : 'Reset Password'}
                                                        </Button>
                                                    </Form>
                                                )}
                                                </Formik>
                                                </div>
                                            </div>
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

export default ProfileUser