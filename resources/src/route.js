import React,{useEffect} from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";

import Home from "./pages/home"
import About from "./pages/about"
import LayoutAdmin from './layouts/admin';
import Login from './pages/auth/login';
import JurusanIndex from './pages/master/jurusan/jurusan';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = () => {
    const roles = localStorage.getItem('access_token');
    
    if (roles == null) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet/>;
     
};


const RoutePage = () => {
    return (
    <div>
        {/* <BrowserRouter>
            <Switch>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<About />} />
            </Switch>
        </BrowserRouter> */}

        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />

                <Route element={<ProtectedRoute/>}>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/master/jurusan" element={<JurusanIndex />} />
                </Route>
            </Routes>
        </Router>
    </div>
    )
}

export default RoutePage