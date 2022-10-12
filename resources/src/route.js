import React,{useEffect} from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";

import Home from "./pages/home"
import About from "./pages/about"
import LayoutAdmin from './layouts/admin';
import Login from './pages/auth/login';
import JurusanIndex from './pages/master/jurusan/jurusan';
import { useNavigate } from 'react-router-dom';
import KelasIndex from './pages/master/kelas/kelas';
import RombelIndex from './pages/master/rombel/rombel';
import TahunAjarIndex from './pages/master/tahun_ajar/tahun_ajar';
import SiswaIndex from './pages/master/siswa/siswa';
import LiburIndex from './pages/libur/libur';

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

                    <Route path="/setting/libur" element={<LiburIndex />} />

                    <Route path="/master/siswa" element={<SiswaIndex />} />
                    <Route path="/master/jurusan" element={<JurusanIndex />} />
                    <Route path="/master/kelas" element={<KelasIndex />} />
                    <Route path="/master/rombel" element={<RombelIndex />} />
                    <Route path="/master/tahun-ajar" element={<TahunAjarIndex />} />
                </Route>
            </Routes>
        </Router>
    </div>
    )
}

export default RoutePage