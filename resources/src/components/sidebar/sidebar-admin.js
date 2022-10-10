import React from 'react'
import { Link } from 'react-router-dom'

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
                <Link className="nav-link" to='/'><i
                        className="fas fa-fire"></i>
                    <span>Dashboard</span></Link>
            </li>
            <li className="">
                <Link className="nav-link" to='/about'><i
                        className="fas fa-fire"></i>
                    <span>Dashboard</span></Link>
            </li>


           
        </ul>

    </div>
  )
}

export default SidebarAdmin