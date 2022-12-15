import React from 'react'
import SidebarAdmin from '../components/sidebar/sidebar-admin'
import { Link } from 'react-router-dom';
import "../../js/scripts";
import "../../js/stisla";

const LayoutAdmin = ({children}) => {

  return (
    <div>
        <div id="app">
            <div className="main-wrapper">
                <div className="navbar-bg bg-nu"></div>
                <nav className="navbar navbar-expand-lg main-navbar justify-content-between">
                    <ul className="navbar-nav mr-3">
                        <li>
                            <a href="#" data-toggle="sidebar" className="nav-link nav-link-lg"> =
                            </a>
                        </li>
                    </ul>
                    {/* <ul className="navbar-nav navbar-right">
                        <li className="dropdown">
                            <a href="#" data-toggle="dropdown"
                                className="nav-link dropdown-toggle nav-link-lg nav-link-user">
                                <i className="fas fa-user-circle mr-1"></i>
                                <div className="d-sm-none d-lg-inline-block"></div>
                            </a>
                            <div className="dropdown-menu dropdown-menu-right">
                                <Link to="/profile" className="dropdown-item has-icon">
                                    <i className="far fa-user"></i> Profile
                                </Link>
                                <a href="" className="dropdown-item has-icon">
                                    <i className="fas fa-cog"></i> Settings
                                </a>
                                <div className="dropdown-divider"></div>
                                <form id="logout-form" action="" method="POST" className="d-none">
                                    
                                </form>
                                <a href="" className="dropdown-item has-icon text-danger">

                                    <i className="fas fa-sign-out-alt"></i> Logout
                                </a>
                            </div>
                        </li>
  </ul> */}
                </nav>
                
                <div className="main-sidebar sidebar-style-2">
                    <aside id="sidebar-wrapper">
                        <SidebarAdmin/>
                    </aside>
                </div>

                
                <div className="main-content pt-6">
                    {/* <div className="judul">Hallo</div> */}
                    <section className="section">
                        {children}
                    </section>
                </div>
            
                <footer className="main-footer">
                    
                </footer>
            </div>
        </div>
    </div>
  )
}

export default LayoutAdmin