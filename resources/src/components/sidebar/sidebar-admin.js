import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import {HiViewGridAdd, HiCalendar, HiOutlineLogout, HiFolder, HiSwitchVertical, HiOutlineClipboardList} from 'react-icons/hi';
import { useNavigate, Navigate } from 'react-router-dom';

const SidebarAdmin = () => {

    const navigate = useNavigate();

    const logout = () => {
        sessionStorage.clear();
        window.location.reload(false);
    }

  return (
    <div>

        <div className="sidebar-brand my-3">
            <h4 className="text-nu mb-0">Absensi</h4>
        </div>

        <div className="sidebar-brand sidebar-brand-sm">
            <Link to='/'>St</Link>
        </div>

        <ul className="sidebar-menu">
            <li className="menu-header">Dashboard</li>

            <li className="">
                <NavLink className="nav-link" to='/admin'>
                    <HiViewGridAdd className="mx-2 fs-6"/>
                <span>Dashboard</span></NavLink>{" "}
            </li>{" "}

            <li className="nav-item dropdown">
                <a className="nav-link has-dropdown" data-toggle="dropdown">{" "}
                    <HiOutlineClipboardList className="mx-2 fs-6"/>
                    <span>Rekap</span></a>
                <ul className="dropdown-menu">
                    <li><NavLink className="nav-link" to='/kehadiran/siswa'>Kehadiran</NavLink></li>
                </ul>
            </li>

            <li className="nav-item dropdown">
                <a className="nav-link has-dropdown" data-toggle="dropdown">{" "}
                    <HiCalendar className="mx-2 fs-6"/>
                    <span>Jadwal</span></a>{" "}
                <ul className="dropdown-menu">{" "}
                    <li><NavLink className="nav-link" to='/setting/libur'>Setting Libur</NavLink></li>{" "}
                    <li><NavLink className="nav-link" to='/setting/jadwal-siswa'>Setting Jadwal</NavLink></li>{" "}
                </ul>
            </li>

            <li className="">
                <NavLink className="nav-link" to='/izin/siswa'>
                    <HiSwitchVertical className="mx-2 fs-6"/>
                <span>Izin</span></NavLink>
            </li>

            <li className="nav-item dropdown">
                <a className="nav-link has-dropdown" data-toggle="dropdown">
                    <HiFolder className="mx-2 fs-6"/>
                    <span>Master</span></a>
                <ul className="dropdown-menu">
                    <li><NavLink className="nav-link" to='/master/admin'>Admin</NavLink></li>
                    <li><NavLink className="nav-link" to='/master/siswa'>Siswa</NavLink></li>
                    <li><NavLink className="nav-link" to='/master/guru'>Guru</NavLink></li>
                    <li><NavLink className="nav-link" to='/master/jurusan'>Jurusan</NavLink></li>
                    <li><NavLink className="nav-link" to='/master/kelas'>Kelas</NavLink></li>
                    <li><NavLink className="nav-link" to='/master/rombel'>Rombel</NavLink></li>
                    <li><NavLink className="nav-link" to='/master/tahun-ajar'>Tahun Ajar</NavLink></li>
                </ul>
            </li>

            <li className="">
                <NavLink className="nav-link" onClick={logout}>
                    <HiOutlineLogout className="mx-2 fs-6"/>
                <span>Logout</span></NavLink>{" "}
            </li>{" "}

           
        </ul>

        

    </div>
  )
}

export default SidebarAdmin