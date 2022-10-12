import React from 'react'
import { Link } from 'react-router-dom'
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
                <Link className="nav-link" to='/'>
                    <HiViewGridAdd className="mx-2 fs-6"/>
                <span>Dashboard</span></Link>
            </li>

            <li className="nav-item dropdown">
                <a href="#" className="nav-link has-dropdown" data-toggle="dropdown">
                    <HiViewGridAdd className="mx-2 fs-6"/>
                    <span>Setting</span></a>
                <ul className="dropdown-menu">
                    <li><Link className="nav-link" to='/setting/libur'>Libur</Link></li>
                </ul>
            </li>

            <li className="nav-item dropdown">
                <a href="#" className="nav-link has-dropdown" data-toggle="dropdown">
                    <HiViewGridAdd className="mx-2 fs-6"/>
                    <span>Master</span></a>
                <ul className="dropdown-menu">
                    <li><Link className="nav-link" to='/master/siswa'>Siswa</Link></li>
                    <li><Link className="nav-link" to='/master/jurusan'>Jurusan</Link></li>
                    <li><Link className="nav-link" to='/master/kelas'>Kelas</Link></li>
                    <li><Link className="nav-link" to='/master/rombel'>Rombel</Link></li>
                    <li><Link className="nav-link" to='/master/tahun-ajar'>Tahun Ajar</Link></li>
                </ul>
            </li>


           
        </ul>

        

    </div>
  )
}

export default SidebarAdmin