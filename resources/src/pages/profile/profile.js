import { Field, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react'
import { getProfile, updateProfile, changePassword  } from '../../api/profile/api_profile';
import LayoutAdmin from '../../layouts/admin'

const ProfilePage = () => {

    let [data, setData] = useState({
    });

    useEffect(() => {
        getData();
    },[]);

    const getData = async () => {
        let data = await getProfile();
        let datas = {
            nama: data.data.nama,
            email: data.data.email,
        }
        console.log(datas);
        setData(data.data);
    }

    function validateEmail(value) {
        let error;
        if (!value) {
          error = 'Required';
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
          error = 'Invalid email address';
        }
        return error;
      }

    function validateUser(value) {
        let error;
        if (value === 'admin') {
          error = 'Nice try!';
        }
        return error;
    }


  return (
    <LayoutAdmin>
        <div className="section-header">
                <h1>Profile</h1>
                <div className="section-header-breadcrumb">
                    <div className="breadcrumb-item active"><a href="#">Dashboard</a></div>
                    <div className="breadcrumb-item">Profile</div>
                </div>
        </div>
        
        <div className="section-body">
                <div className="row mt-sm-4">

                    <div className="col-6">
                        <div className="row">
                            <div className="col-12 col-md-12">
                                <div className="card profile-widget">
                                    <div className="profile-widget-header">
                                        <img alt="image"
                                            src={data.file}
                                            className="rounded-circle profile-widget-picture"/>
                                        <div className="profile-widget-items">
                                            
                                            <div className="profile-widget-item">
                                                <div className="profile-widget-item-label">Jenis Kelamin</div>
                                                <div className="profile-widget-item-value"></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="profile-widget-description">

                                        <div className="profile-widget-name">
                                            {data.nama}
                                        </div>                       

                                        <div className="profile-widget-item-label font-weight-bolder my-1">Email</div>
                                        <div className="profile-widget-item-value">{data.email}</div>

                                        
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-6">
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
                                                console.log(values);
                                                
                                                let res = await updateProfile(values);
                                                
                                                if(res.status == 200){
                                                    getData();
                                                    swal("Good job!", "Sukses", "success");
                                                }else{
                                                    swal("Error", res.message, "warning");
                                                }
                            
                                            }}
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
                                                    validate={validateUser}
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
                                                    validate={validateEmail}
                                                    required
                                                />
                                                {errors.email && touched.email && errors.email}
                                            </div>

                                            <button type="submit" className="btn btn-nu btn-lg btn-block" disabled={isSubmitting}>
                                                Submit
                                            </button>
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
                                                    console.log(values);
                                                    
                                                    let res = await changePassword(values);
                                                    
                                                    if(res.status == 200){
                                                        getData();
                                                        swal("Good job!", res.message, "success");
                                                        setSubmitting(false)
                                                    }else{
                                                        swal("Error", res.message, "warning");
                                                    }
                                
                                                }}
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
                                                        validate={validateUser}
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
                                                        validate={validateUser}
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
                                                        validate={validateUser}
                                                        required
                                                    />
                                                    {errors.confirm_password && touched.confirm_password && errors.confirm_password}
                                                </div>

                                                <button type="submit" className="btn btn-nu btn-lg btn-block" disabled={isSubmitting}>
                                                    Reset Password
                                                </button>
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
    </LayoutAdmin>
  )
}

export default ProfilePage