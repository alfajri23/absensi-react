import React, {useEffect, useState, useRef} from 'react'
import { Link } from 'react-router-dom';
import { Formik, Field } from 'formik';
import LayoutAdmin from '../../layouts/admin';
import { getAll as getRombel } from '../../api/api_rombel';
import swal from 'sweetalert'; 
import * as Yup from 'yup';
import Select from 'react-select';
import Form from 'react-bootstrap/Form';
import { getIdSekolah, getTahunAjar } from '../../auth/auth';
import { absenAdmin, filterRombelTanggalAbsen } from '../../api/master/api_siswa';

const Presensi = () => {

    let [rombel, setRombel] = useState([]);
    let tanggal_hadir = useRef();
    const id_ta_sm = useRef(getTahunAjar());
    const id_sekolah = useRef(getIdSekolah());
    let radio = useRef([]);
    let [radioData, setRadioData] = useState([]); 

    const initRombel = async () => {
        let data = await getRombel();
        if(data.data != null){
            let rombel = data.data.map(item => {
                return {
                  value: item.id,
                  label: item.nama
                };
            });
            setRombel(rombel)
        }else{
            swal("Error", data.message, "warning");
        }
    }

    const loops = (value) => {
        return {
            ...value,
            id_ta_sm : id_ta_sm.current,
            id_sekolah: id_sekolah.current,
            id_user: value.id,
            tgl_kehadiran: tanggal_hadir.current,
        };
    }

    const getData = async (id_rombel, tanggal) => {
        let res = await filterRombelTanggalAbsen(id_rombel, getTahunAjar(), tanggal);
        setRadioData([]);
        
        if(res.data.data.length > 0){
            let dataLoop = res.data.data.map(loops);
            radio.current = dataLoop;
            setTimeout(() =>{
                setRadioData(dataLoop);
            },100)
        }
    }

    useEffect(() => {
        initRombel();
    },[]);

    const selectRadio = (id,value) => {
        let rad = radio.current;
        rad[id].status_kehadiran = value;
        radio.current = rad;
    }

    const actionAbsen = async () => {
        let req = await absenAdmin({
            kehadirans: radio.current
        });

        if(req.status === 200){
            swal("Sukses", "sukses", "success");
        }else{
            swal("Error", res.message, "warning");
        }
    }

    const validateForm  = Yup.object().shape({
        tanggal: Yup.string()
          .required('Harus diisi'),
    });


  return (
    <LayoutAdmin>
        <div>
            <div className="section-header">
                <h1>Presensi Manual</h1>
                <div className="section-header-breadcrumb">
                    <div className="breadcrumb-item active">
                        <Link to="/admin">Dashboard</Link>
                    </div>
                    <div className="breadcrumb-item">Presensi</div>
                </div>
            </div>

            <div className="row">
                <div className="card">
                    <div className="card-body">
                        <div className="container-fluid">

                        <Formik
                            initialValues={{
                                rombel: '',
                                tanggal: '',
                            }}
                            onSubmit={async (values, { setSubmitting })=>{
                                tanggal_hadir.current = values.tanggal;
                                await getData(values.rombel.value, values.tanggal);
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
                                    
                                    <div className="col-2 ">
                                        <label className="form-label mb-0">Rombel</label>
                                        <Select
                                            placeholder="rombel"
                                            value={values.rombel}
                                            onChange={(option, action) => {
                                                setFieldValue('rombel', option);
                                            }}
                                            isSearchable={true}
                                            options={rombel}
                                            name="rombel"
                                            isMulti={false}
                                            isLoading={false}
                                            loadingMessage={() => "Fetching rombel"}
                                            noOptionsMessage={() => "tidak ada rombel"}
                                        />
                                        <small className="text-danger">{errors.rombel}</small>
                                    </div> 

                                    <div className="col-2 mx-2">
                                        <label className="form-label mb-0">Tanggal</label>
                                        <Field name="tanggal" type="date" className="form-control">

                                        </Field>
                                        <small className="text-danger">{errors.tanggal}</small>
                                    </div>

                                    <div className="col-auto mx-1">
                                        <label className="form-label mb-0">&nbsp;</label><br></br>
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


                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th scope="col">No</th>
                                        <th scope="col">Nama</th>
                                        <th scope="col">Hadir</th>
                                        <th scope="col">Izin</th>
                                        <th scope="col">Sakit</th>
                                        <th scope="col">Alpha</th>
                                    </tr>
                                </thead>
                                <tbody>

                                    {radioData.map((result,key) => {
                                        return(
                                            <tr key={key}>
                                                <th scope="row">{key+1}</th>
                                                <td>{result.name}</td>
                                                <td><Form.Check onClick={()=>{ selectRadio( key,'hadir')}} name={key} type="radio" defaultChecked={result.status_kehadiran === 'hadir'}/></td>
                                                <td><Form.Check onClick={()=>{ selectRadio( key,'izin')}} name={key} type="radio" defaultChecked={result.status_kehadiran === 'izin'}/></td>
                                                <td><Form.Check onClick={()=>{ selectRadio( key,'sakit')}} name={key} type="radio" defaultChecked={result.status_kehadiran === 'sakit'}/></td>
                                                <td><Form.Check onClick={()=>{ selectRadio( key,'alpha')}} name={key} type="radio" defaultChecked={result.status_kehadiran === 'alpha'}/></td>
                                            </tr>
                                        )
                                    })}
                                    

                                </tbody>
                            </table>

                            <div>
                                <button className="btn btn-success" onClick={()=>{actionAbsen()}}>
                                    Presensi
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

        </div>
    </LayoutAdmin>
  )
}

export default Presensi