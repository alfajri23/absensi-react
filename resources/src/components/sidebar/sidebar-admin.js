import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import {HiViewGridAdd} from 'react-icons/hi';

const SidebarAdmin = () => {
  return (
    <div>

        <div className="sidebar-brand my-3">
            <h4 className="text-nu mb-0">NU</h4>
            <img src="" alt="logo" width="150" className="rounded-circle"/>
        </div>

        <div className="sidebar-brand sidebar-brand-sm">
            <Link to='/'>St</Link>
        </div>

        <ul className="sidebar-menu">
            <li className="menu-header">Dashboard</li>

            <li className="">
                <NavLink className="nav-link" to='/'>
                    <HiViewGridAdd className="mx-2 fs-6"/>
                <span>Dashboard</span></NavLink>{" "}
            </li>{" "}

            <li className="nav-item dropdown">
                <a className="nav-link has-dropdown" data-toggle="dropdown">{" "}
                    <HiViewGridAdd className="mx-2 fs-6"/>
                    <span>Jadwal</span></a>{" "}
                <ul className="dropdown-menu">{" "}
                    <li><NavLink className="nav-link" to='/setting/libur'>Setting Libur</NavLink></li>{" "}
                    <li><NavLink className="nav-link" to='/setting/jadwal-siswa'>Setting Jadwal</NavLink></li>{" "}
                </ul>
            </li>

            <li className="">
                <NavLink className="nav-link" to='/izin/siswa'>
                    <HiViewGridAdd className="mx-2 fs-6"/>
                <span>Izin</span></NavLink>
            </li>


            <li className="nav-item dropdown">
                <a className="nav-link has-dropdown" data-toggle="dropdown">
                    <HiViewGridAdd className="mx-2 fs-6"/>
                    <span>Master</span></a>
                <ul className="dropdown-menu">
                    <li><NavLink className="nav-link" to='/master/admin'>Admin</NavLink></li>
                    <li><NavLink className="nav-link" to='/master/siswa'>Siswa</NavLink></li>
                    <li><NavLink className="nav-link" to='/master/jurusan'>Jurusan</NavLink></li>
                    <li><NavLink className="nav-link" to='/master/kelas'>Kelas</NavLink></li>
                    <li><NavLink className="nav-link" to='/master/rombel'>Rombel</NavLink></li>
                    <li><NavLink className="nav-link" to='/master/tahun-ajar'>Tahun Ajar</NavLink></li>
                </ul>
            </li>


           
        </ul>

        

    </div>
  )
}

export default SidebarAdmin