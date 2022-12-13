import React from 'react'
import { NavLink } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';

const logout = () => {
    sessionStorage.clear();
    window.location.reload(false);
}

const LayoutUser = ({children}) => {
  return (
    <div>
        <div id="app">
            <div className="">
                <Navbar bg="white" variant="light" expand="md" style={{zIndex: "100"}} className="my-0 position-static">
                    <Container>
                        <NavLink className="text-primary navbar-brand" to="/">
                            Absensi
                        </NavLink>
                        
                        <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-lg`} />

                        <Navbar.Offcanvas
                        id={`offcanvasNavbar-expand-md`}
                        aria-labelledby={`offcanvasNavbarLabel-expand-md`}
                        placement="start"
                        >
                            <Offcanvas.Header closeButton>
                                <Offcanvas.Title id={`offcanvasNavbarLabel-expand-lg`}>
                                Absensi
                                </Offcanvas.Title>
                            </Offcanvas.Header>

                            <Offcanvas.Body>
                                <Nav className="justify-content-end flex-grow-1 pe-3">
                                <NavLink className="text-dark nav-link" to="/">
                                    Dashboard
                                </NavLink>
                                <NavLink className="text-dark nav-link" to="/izin">
                                    Riwayat
                                </NavLink>
                                <NavLink className="text-dark nav-link" to="/profil">
                                    Profile
                                </NavLink>
                                <Nav.Link className="text-dark" onClick={logout}>
                                    Logout
                                </Nav.Link>
                                </Nav>
                            </Offcanvas.Body>
                        </Navbar.Offcanvas>
                    </Container>
                </Navbar>              
      
                <div className="container-fluid">
                {children}
                </div>
            </div>
        </div>
    </div>
  )
}

export default LayoutUser