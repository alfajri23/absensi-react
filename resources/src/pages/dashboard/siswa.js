import React, {useState, useEffect, useRef} from 'react'
import LayoutUser from '../../layouts/user';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Webcam from "react-webcam";
import {FaCircleNotch} from 'react-icons/fa';
import Alert from 'react-bootstrap/Alert';
import Modal from 'react-bootstrap/Modal';
import { Field, Form, Formik} from 'formik';
import * as Yup from 'yup';

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

import {
  MapContainer,
  TileLayer,
  useMap,
  Marker,
  Popup
} from 'react-leaflet';

import { create as storeIzin } from '../../api/izin/api_izin';
import { getDataMasuk, storeAbsensi } from '../../api/hadir/api_hadir';
import { getIdKelasSiswa, getId, getIdSekolah, getRole, getTahunAjar } from '../../auth/auth';
import { statistikKehadiran } from '../../api/api_dashboard';
import { set } from 'lodash';



const LocationMarker = () => {
  const [position, setPosition] = useState(null);
  const [bbox, setBbox] = useState([]);

  const map = useMap();

  useEffect(() => {
    map.locate().on("locationfound", function (e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
      const radius = e.accuracy;
      const circle = L.circle(e.latlng, radius);
      circle.addTo(map);
      setBbox(e.bounds.toBBoxString().split(","));
    });
  }, [map]);

  return position === null ? null : (
    <Marker position={position} >
      <Popup>
        You are here. <br />
        Map bbox: <br />
        <b>Southwest lng</b>: {bbox[0]} <br />
        <b>Southwest lat</b>: {bbox[1]} <br />
        <b>Northeast lng</b>: {bbox[2]} <br />
        <b>Northeast lat</b>: {bbox[3]}
      </Popup>
    </Marker>
  );
}

const DashboardSiswa = () => {
  
  let [photo, setPhoto ] = useState();
  let [ jamMasuk, setjamMasuk ] = useState({});
  let [ position, setPosition ] = useState({});
  let [ statKehadiran, setStatKehadiran ] = useState({});
  let [ device, setDevice] = useState({
    width : 0, height: 0
  });

  // Loading Button
  const [loading, setLoading] = useState(false);

  // Modal
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user"
  };

  const getData = async () => {
    let data = await getDataMasuk(getIdKelasSiswa());
    if(data.data != null){
      setjamMasuk(data.data);
    }else{
      setjamMasuk(data);
      swal("Error", data.message, "warning");
    }
  }
  

  // Chart
  // const dataChart = {
  //   labels: [
  //     `Hadir ${statKehadiran.hadir_percent}`,
  //     `Izin ${statKehadiran.izin_percent}`,
  //   ],
  //   datasets: [{
  //     data: [
  //       statKehadiran.hadir_count,
  //       statKehadiran.izin_count,
  //     ],
  //     backgroundColor: [
  //     '#FF6384',
  //     '#36A2EB',
  //     ],
  //     hoverBackgroundColor: [
  //     '#FF6384',
  //     '#36A2EB',
  //     ]
  //   }]
  // };

  // const optionChart = {
  //   maintainAspectRatio: true,
  //   responsive: false,
  //   legend: {
  //     display: true,
  //     position: 'right',
  //     labels: {
  //       boxWidth: 10
  //     }
  //   },
  //   datalabels: {
  //     display: true,
  //     color: "white",
  //   },
  //   tooltips: {
  //     backgroundColor: "#5a6e7f",
  //   },
  // }

  const getStatHadir = async () => {
    let res = await statistikKehadiran(getRole(),getId(),new Date().getMonth() + 1,new Date().getFullYear());
    
    if(res.status == 200){
        console.log('data',res.data.data);
        setStatKehadiran(res.data.data);
    }else{
      swal("Error", "error get kahadiran", "warning");
    }
    
  }

  const actionAbsensi = async () => {
      setLoading(true);
      let req = {
          id_kelas_siswa : getIdKelasSiswa(),
          long : position.long,
          lat : position.lat,
          id_ta_sm : getTahunAjar(),
          id_sekolah : getIdSekolah(),
          file : photo
      };

      if(photo == null){
        swal("Error", 'Harap foto terlebih dahulu', "warning");
        setLoading(false);
      }else{
        let res = await storeAbsensi(req);
        console.log(res);

        setLoading(false);
        swal("Info", res.message, "success");

      }
      

  }

  useEffect(() => {
    getData();    
    getStatHadir();

    if(/Android|webOS|iPhone|iPad|iPod|IEMobile|Opera Mini/i.test(navigator.userAgent)){
      setDevice({
        ...device,
        width: 720, height: 1280
      })
      console.log('hp');
    }else{
      setDevice({
        ...device,
        width: 1280, height: 720
      });
      console.log('pc');
    }

    
    

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos)=>{
        setPosition({
          long : pos.coords.longitude,
          lat : pos.coords.latitude
        });
      });
    } else {
      swal("Error", 'Lokasi tidak ditemukan, mohon aktifkan lokasi', "warning");
    }


  },[]);


  const webcamRef = React.useRef(null);
  const capture = React.useCallback(
    () => {
      //let imageSrc = webcamRef.current.getScreenshot({width: 1280, height: 720});
      let imageSrc = webcamRef.current.getScreenshot({width: device.width, height: device.height  });
      console.log('device',device);
      setPhoto(imageSrc);
    },
    [webcamRef]
  );

  const validateForm  = Yup.object().shape({
    keterangan: Yup.string()
      .required('Harus diisi'),
    tanggal: Yup.string()
      .required('Harus diisi'),
  });

  return (
    <>
        <LayoutUser>
            <Container fluid="lg" className="px-0">
                <Row>
                    <Col sm={12} md={12} className="p-3">
                          <Row>
                            <Col xs={12}>
                              <Card>
                                <Card.Body>
                                  <h5>{new Date().toLocaleDateString('id', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}<br></br> </h5>
                                  { jamMasuk != null ? 
                                  <div>
                                    <h6>Jam masuk {jamMasuk.jam_masuk}
                                    <br></br> Jam pulang {jamMasuk.jam_pulang}</h6>
                                  </div> 
                                  : 'Tidak ada jadwal'
                                  }
                                  
                                  
                                </Card.Body>
                              </Card>
                            </Col>

                            <Col sm={12}>
                              <MapContainer
                                center={[110.26669995616746, -7.361558828513047]}
                                zoom={13}
                                scrollWheelZoom={false}
                                // style={{ height: "100vh" }}
                              >
                                <TileLayer
                                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <LocationMarker />
                              </MapContainer>
                            </Col>

                            <Col xs={6} lg={6} sm={6} className="mt-2 pe-1 position-relative">
                              <div className="w-100">
                                <Webcam
                                  audio={false}
                                  ref={webcamRef}
                                  screenshotFormat="image/jpeg"
                                  width={`100%`}
                                  //height={`100%`}
                                  //width={1280}
                                  videoConstraints={videoConstraints}
                                  style={{borderRadius: `10px`}}
                                />
                                <button className="btn btn-sm bg-transparent" onClick={capture}
                                  style={{
                                    position: 'absolute',
                                    width: '60%',
                                    left: 0,
                                    right: 0,
                                    marginLeft: 'auto',
                                    marginRight: 'auto',
                                    bottom: '10%',
                                  }}
                                >
                                    <FaCircleNotch className="fa-lg text-white"></FaCircleNotch><br/>
                                    <span className="text-white">Take a picture</span>
                                        
                                </button>
                              </div>
                            </Col>

                            <Col xs={6} lg={6} sm={6} className="mt-2 ps-1">
                              <div className="w-100">
                                <img src={ photo != null ? photo : ``} style={{borderRadius: `10px`, width: '100%'}}/>
                              </div>
                            </Col>

                            <Col sm={12} className="mt-3">
                              <Row>
                                <Col xs={6} className="pe-1">
                                  <Button onClick={handleShow} variant="outline-danger w-100">Izin</Button>
                                </Col>

                                <Col xs={6} className="ps-1">
                                  <Button onClick={actionAbsensi} variant="success w-100" disabled={jamMasuk != null ? false : true}>
                                    { loading ? 
                                    <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    <span>Loading</span>
                                    </>
                                      : 'Presensi'}
                                  </Button>
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                        {/* </Card.Body>
                      </Card> */}
                    </Col>

                </Row>
            </Container>

            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Izin</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Formik
                  initialValues={{ alasan: "", tanggal: "", keterangan: "", file: "" }}
                  onSubmit={ async (values) => {

                      const formData = new FormData();
                      formData.append('id_ta_sm', getTahunAjar());
                      formData.append('long', position.long);
                      formData.append('lat', position.lat);
                      formData.append('id_sekolah', getIdSekolah());
                      formData.append('keterangan', values.keterangan);
                      formData.append('status_kehadiran', values.alasan);
                      formData.append('tgl_kehadiran', values.tanggal);
                      formData.append('file', values.file);

                      console.log(values.file);

                      let res = await storeIzin(formData);
                    
                      if(res.status == 200){
                          handleClose();
                          swal("Good job!", "Sukses", "success");
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

              {/* <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Close
                </Button>
                <Button variant="primary" onClick={handleClose}>
                  Save Changes
                </Button>
              </Modal.Footer> */}

              
              
            </Modal>

        </LayoutUser>
    </>
  )
}

export default DashboardSiswa