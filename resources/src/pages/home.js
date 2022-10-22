import React, { useState, useEffect } from "react";
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom'
import LayoutAdmin from "../layouts/admin";
import { HiUsers, HiUserGroup, HiClipboardCopy } from 'react-icons/hi';

const Home = () => {

    let url_backend = `https://backend-lms.mysch.web.id/`;
    let url_data = `api/data/master/sekolah/search/by/domain/sekolah/`;
    let host = 'mysch.web.id';
    
    // State
    let [program, setProgram] = useState([]);
    let [sekolah, setSekolah] = useState({});
    let [slider, setSlider] = useState([]);

    useEffect(() => {
        Promise.all([
            fetch(`${url_backend}${url_data}${host}`, {
                mode: 'cors',
                headers: {
                  'Access-Control-Allow-Origin':'*',
                  'mode': 'no-cors',
                }
              }),
            fetch(`${url_backend}api/data/master/program/program/all/aktif`, {
                mode: 'cors',
                headers: {
                  'Access-Control-Allow-Origin':'*',
                  'mode': 'no-cors',
                }
              }),
            fetch(`${url_backend}api/data/master/slider/sekolah/${localStorage.getItem("id_sekolah")}`, {
                mode: 'cors',
                headers: {
                  'Access-Control-Allow-Origin':'*',
                  'mode': 'no-cors',
                }
              })
          ]).then(allResponses => {
            allResponses[0].json()
            .then(data => {
                setSekolah(data.data)
                localStorage.setItem("id_sekolah", data.data.id);
            });
            allResponses[1].json()
            .then(data => {
                setProgram(data.data);
            });
            allResponses[2].json()
            .then(data => {
                setSlider(data.data);
            });
        })

        
    },[]);

    return(
        <LayoutAdmin>
        <div>
            <div className="section-header">
                <h1>Dashboard</h1>
                <div className="section-header-breadcrumb">
                    <div className="breadcrumb-item active">
                        <Link to="/">Dashboard</Link>
                    </div>
                </div>
            </div>

            <div className="row">

                <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                    <div className="card card-statistic-1">
                        <div className="card-icon bg-light">
                            <HiUsers className="fs-1"/>
                        </div>
                        <div className="card-wrap">
                            <div className="card-header">
                                <h4>Total Guru</h4>
                            </div>
                            <div className="card-body">
                                12
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                    <div className="card card-statistic-1">
                        <div className="card-icon bg-warning">
                            <HiUserGroup className="fs-1 text-white"/>
                        </div>
                        <div className="card-wrap">
                            <div className="card-header">
                                <h4>Total Siswa</h4>
                            </div>
                            <div className="card-body">
                                12
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                    <div className="card card-statistic-1">
                        <div className="card-icon bg-info">
                            <HiClipboardCopy className="fs-1 text-white"/>
                        </div>
                        <div className="card-wrap">
                            <div className="card-header pt-3 px-0">
                                <h4>Pengajuan ijin Guru Hari ini</h4>
                            </div>
                            <div className="card-body">
                                12
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                    <div className="card card-statistic-1">
                        <div className="card-icon bg-light">
                            <HiUsers className="fs-1"/>
                        </div>
                        <div className="card-wrap">
                            <div className="card-header pt-3 px-0">
                                <h4>Pengajuan ijin Siswa Hari ini</h4>
                            </div>
                            <div className="card-body">
                                12
                            </div>
                        </div>
                    </div>
                </div>

            </div>


        </div>
        </LayoutAdmin>
    )
}

export default Home;