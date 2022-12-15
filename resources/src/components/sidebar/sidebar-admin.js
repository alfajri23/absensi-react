import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import {HiViewGridAdd, HiOutlineCalendar, HiOutlineUserCircle, HiOutlineLogout, HiOutlineFolderRemove, HiSortAscending, HiOutlineClipboardList} from 'react-icons/hi';
import { useNavigate, Navigate } from 'react-router-dom';
import {MdOutlineAutoDelete} from 'react-icons/md';

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
            <li className="">
                <NavLink className="nav-link" to='/admin'>
                    <HiViewGridAdd className="mx-2 fs-5"/>
                <span>Dashboard</span></NavLink>{" "}
            </li>

            <li className="">
                <NavLink className="nav-link" to='/presensi'>
                    <HiSortAscending className="mx-2 fs-5"/>
                <span>Presensi</span></NavLink>
            </li>

            <li className="nav-item dropdown">
                <a className="nav-link has-dropdown" data-toggle="dropdown">{" "}
                    <HiOutlineClipboardList className="mx-2 fs-5"/>
                    <span>Absensi</span></a>
                <ul className="dropdown-menu">
                    <li><NavLink className="nav-link" to='/kehadiran/siswa'>Kehadiran</NavLink></li>
                    <li><NavLink className="nav-link" to='/izin/siswa'>Izin</NavLink></li>
                </ul>
            </li>

            <li className="nav-item dropdown">
                <a className="nav-link has-dropdown" data-toggle="dropdown">{" "}
                    <HiOutlineCalendar className="mx-2 fs-5"/>
                    <span>Jadwal</span></a>{" "}
                <ul className="dropdown-menu">{" "}
                    <li><NavLink className="nav-link" to='/setting/libur'>Setting Libur</NavLink></li>{" "}
                    <li><NavLink className="nav-link" to='/setting/jadwal-siswa'>Setting Jadwal</NavLink></li>{" "}
                </ul>
            </li>

            <li className="nav-item dropdown">
                <a className="nav-link has-dropdown" data-toggle="dropdown">
                    <HiOutlineFolderRemove className="mx-2 fs-5"/>
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
                <NavLink className="nav-link" to='/reset'>
                    <MdOutlineAutoDelete className="mx-2 fs-5"/>
                <span>Reset</span></NavLink>
            </li>

            <li className="">
                <NavLink className="nav-link" to='/profile'>
                    <HiOutlineUserCircle className="mx-2 fs-5"/>
                <span>Profile</span></NavLink>
            </li>

            <li className="">
                <NavLink className="nav-link" onClick={logout}>
                    <HiOutlineLogout className="mx-2 fs-5"/>
                <span>Logout</span></NavLink>{" "}
            </li>{" "}

           
        </ul>

        

    </div>
  )
}

export default SidebarAdmin