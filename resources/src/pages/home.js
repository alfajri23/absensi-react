import React, { useState, useEffect, useRef } from "react";
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom'
import LayoutAdmin from "../layouts/admin";
import { HiUsers, HiUserGroup, HiClipboardCopy } from 'react-icons/hi';
import { getByBulan as getLibur, updates as updatesLibur, statusActive } from '../api/api_libur'
import { getIzinSiswa, getIzinGuru, confirm, destroy, detail, updates } from '../api/izin/api_izin'
import { getIdSekolah, getTahunAjar } from "../auth/auth";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
import { Line } from 'react-chartjs-2';
import TableBasic from "../components/table/react-table-basic";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { cardDashboard, statistikKeterlambatan } from "../api/api_dashboard";


ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
};


const Home = () => {

    const labels = ['Loading..'];

    // State
    let [dataLibur, setDataLibur] = useState([]);
    let [dataIzinSiswa, setDataIzinSiswa] = useState([]);
    let [dataIzinGuru, setDataIzinGuru] = useState([]);
    let [chartData, setChartData] = useState({
        labels,
        datasets: [
        {
            label: 'Loading',
            data: [],
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        {
            label: 'Loading',
            data: [],
            borderColor: 'rgb(53, 162, 235)',
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
        ],
    });


    const getDataLibur = async () => {
        const d = new Date();
        let month = d.getMonth();
        let year = d.getFullYear();
        let data = await getLibur(getIdSekolah(), month+1, year);

        if(data.data != null){
            setDataLibur(data.data);
        }else{
            swal("Error", data.message, "warning");
        }
 
    }

    const getDataIzinSiswa = async (mount,year) => {
        let data = await getIzinSiswa(mount,year);
        if(data.data != null){
            setDataIzinSiswa(data.data);
        }else{
            swal("Error", data.message, "warning");
        }
    }

    const getDataIzinGuru = async (mount,year) => {
        let data = await getIzinGuru(mount,year);
        if(data.data != null){
            setDataIzinGuru(data.data);
        }else{
            swal("Error", data.message, "warning");
        }
    }

    const confirms = async (id,action) => {
        let konfirm = {
            id: id,
            konfirmasi: action
        };

        console.log(konfirm);
        let res = await confirm(konfirm);

        if(res.status == 200){
            getData(new Date().getMonth() + 1,new Date().getFullYear());
            swal("Good job!", "Sukses", "success");
        }else{
            swal("Error", res.message, "warning");
        }
    } 


    // Tabel Libur
    const setAktif = async (id,action) => {
        let konfirm = {
            id: id,
            value : action
        };

        let res = await statusActive(konfirm);
        if(res.status == 200){
            getDataLibur();
            swal("Good job!", "Sukses", "success");
        }else{
            swal("Error", res.message, "warning");
        }

    }

    const columnFormat = {
        status: ({value, row}) => {
            switch(value) {
                case 1:
                  return(
                    <div key={row.original.id} className="form-check form-switch" onChange={()=>setAktif(row.original.id, 0)}>
                        <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked" defaultChecked={true}/>
                        <label className="form-check-label" htmlFor="flexSwitchCheckChecked">Aktif</label>
                    </div>
                  )
                  break;
                default:
                    return (
                    <div key={row.original.id} className="form-check form-switch" onChange={()=>setAktif(row.original.id, 1)}>
                        <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked" defaultChecked={false}/>
                        <label className="form-check-label" htmlFor="flexSwitchCheckChecked">Tidak Aktif</label>
                    </div>
                )
            }
        },
        date: ({value, row}) => {
            let date = new Date(value);
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            return date.toLocaleDateString('id', options)
        },
    }

    const columnLibur = [
        {
            accessor: 'tgl_libur',
            Header: 'Tanggal',
            Cell: columnFormat.date
        },
        {
            accessor: 'nama',
            Header: 'Nama',
            
        },
        {
            accessor: 'status',
            Header: 'Status',
            Cell: columnFormat.status
        },
    ];

    // Tabel Izin Siswa
    const columnFormatIzinSiswa = {
        status: ({value, row}) => {
            switch(value) {
                case 0:
                    return(
                        <DropdownButton
                            key={row.original.id}
                            id="dropdown-button-dark-example2"
                            variant="warning"
                            // menuVariant="dark"
                            title="Konfirmasi"
                            className=""
                            size="sm"
                        >
                            <Dropdown.Item as="button" onClick={()=>confirms(cell,1)} active>
                            Terima
                            </Dropdown.Item>
                            <Dropdown.Item as="button" onClick={()=>confirms(cell,2)}>
                                Tolak
                            </Dropdown.Item>
                            
                        </DropdownButton>
                    )
                  break;
                case 1:
                  return(<span className="badge text-bg-success">Diterima</span>)
                  break;
                default:
                    return(<span className="badge text-bg-danger">Ditolak</span>)
            }
        },
        date: ({value, row}) => {
            let date = new Date(value);
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            return date.toLocaleDateString('id', options)
        },
    }

    const columnIzinSiswa = [
        {
            accessor: 'tgl_kehadiran',
            Header: 'Tanggal',
            Cell: columnFormatIzinSiswa.date
        },
        {
            accessor: 'nama',
            Header: 'nama',
        },
        {
            accessor: 'rombel',
            Header: 'rombel',
        },
        {
            accessor: 'status_kehadiran',
            Header: 'Ketidakhadiran',
        },
        {
            accessor: 'konfirmasi',
            Header: 'Action',
            Cell: columnFormatIzinSiswa.status
        },
    ]

    // Tabel Izin Guru
    const columnFormatIzinGuru = {
        status: ({value, row}) => {
            switch(value) {
                case 0:
                    return(
                        <DropdownButton
                            key={cell}
                            id="dropdown-button-dark-example2"
                            variant="warning"
                            // menuVariant="dark"
                            title="Konfirmasi"
                            className=""
                            size="sm"
                        >
                            <Dropdown.Item as="button" onClick={()=>confirms(cell,1)} active>
                            Terima
                            </Dropdown.Item>
                            <Dropdown.Item as="button" onClick={()=>confirms(cell,2)}>
                                Tolak
                            </Dropdown.Item>
                            
                        </DropdownButton>
                    )
                  break;
                case 1:
                  return(<span className="badge text-bg-success">Diterima</span>)
                  break;
                default:
                    return(<span className="badge text-bg-danger">Ditolak</span>)
            }
        },
        date: ({value, row}) => {
            let date = new Date(value);
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            return date.toLocaleDateString('id', options)
        },
    }

    const columnIzinGuru = [
        {
            accessor: 'tgl_kehadiran',
            Header: 'Tanggal',
            Cell: columnFormatIzinGuru.date
        },
        {
            accessor: 'nama',
            Header: 'nama',
        },
        {
            accessor: 'status_kehadiran',
            Header: 'Ketidakhadiran',
        },
        {
            accessor: 'konfirmasi',
            Header: 'Action',
            Cell: columnFormatIzinGuru.status
        },
    ]

    // Chart keterlambatan
    const getChartKeterlambatan = async () => {
        let res = await statistikKeterlambatan(getTahunAjar());
        if(res.data != null){ 
            let labels = res.data.label;

            setChartData({
                labels,
                datasets: [
                {
                    label: 'Siswa',
                    data: res.data.siswa_value,
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                },
                {
                    label: 'Guru',
                    data: res.data.guru_value,
                    borderColor: 'rgb(53, 162, 235)',
                    backgroundColor: 'rgba(53, 162, 235, 0.5)',
                },
                ],
            });
        }else{
            console.log('disini');
            swal("Error", res.message, "warning");
        }  
    }

    useEffect(() => {
        getDataLibur();

        getChartKeterlambatan();

        getDataIzinSiswa(new Date().getMonth() + 1,new Date().getFullYear());
        getDataIzinSiswa(new Date().getMonth() + 1,new Date().getFullYear()); 
    },[]);

    return(
        <LayoutAdmin>
        <div>

            <div className="section-header">
                <h1>Dashboard Admin</h1>
            </div>

            {/* Card atas */}
            {/* <div className="row">

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
                                {dataCard.akun_guru}
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
                                {dataCard.akun_siswa}
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
                                <h4>Pengajuan ijin Guru</h4>
                            </div>
                            <div className="card-body">
                                {dataCard.izin_guru}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                    <div className="card card-statistic-1">
                        <div className="card-icon bg-success">
                            <HiClipboardCopy className="fs-1 text-white"/>
                        </div>
                        <div className="card-wrap">
                            <div className="card-header pt-3 px-0">
                                <h4>Pengajuan ijin Siswa</h4>
                            </div>
                            <div className="card-body">
                                {dataCard.izin_siswa}    
                            </div>
                        </div>
                    </div>
                </div>

            </div> */}

            <div className="row">
                <div className="col-6">
                    <div className="card">
                        <div className="card-header">
                            <h4>Pengajuan Izin Siswa Ini</h4>
                        </div>

                        <div className="card-body">
                            <div>
                                <TableBasic datas={dataIzinSiswa} column={columnIzinSiswa} columnFormats={columnFormatIzinSiswa}/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-6">
                    <div className="card">
                        <div className="card-header">
                            <h4>Pengajuan Izin Guru Ini</h4>
                        </div>

                        <div className="card-body">
                            <div>
                            <TableBasic datas={dataIzinGuru} column={columnIzinGuru} columnFormats={columnFormatIzinGuru}/>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>

            <div className="row">
                <div className="col-sm-6 col-12">
                    <div className="card">
                        <div className="card-header">
                            <h4>Jadwal Libur Bulan Ini</h4>
                        </div>

                        <div className="card-body">
                            <div>
                                <TableBasic datas={dataLibur} column={columnLibur} columnFormats={columnFormat}/>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-sm-6 col-12">
                    <div className="card">
                        <div className="card-header">
                            <h4>Jadwal Libur Bulan Ini</h4>
                        </div>

                        <div className="card-body">
                            <div>
                                <Line options={options} data={chartData} />
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