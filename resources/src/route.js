import React,{useEffect, useState} from 'react'
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
import JadwalSiswa from './pages/setting/jadwal/jadwal_siswa';
import { getToken, getRole } from './auth/auth';
import JadwalGuru from './pages/setting/jadwal/jadwal_guru';
import IzinSiswa from './pages/izin/izin_siswa';
import IzinGuru from './pages/izin/izin_guru';
import ProfilePage from './pages/profile/profile';
import AdminIndex from './pages/master/admin/admin';
import KehadiranGuru from './pages/rekap/kehadiran/kehadiran_guru';
import KehadiranSiswa from './pages/rekap/kehadiran/kehadiran_siswa';
import RekapKehadiranSiswa from './pages/rekap/detail/rekap_siswa';
import RekapKehadiranGuru from './pages/rekap/detail/rekap_guru';
import DashboardSiswa from './pages/dashboard/siswa';
import RekapIzinUser from './pages/user/izin_user';
import Radium, { StyleRoot } from 'radium';
import RekapKehadiranUser from './pages/user/kehadiran_user';
import ProfileUser from './pages/profile/profile_user';
import PageNotFound from './pages/404';
import GuruIndex from './pages/master/guru/guru';

const ProtectedRoute = ({user}) => {
    
    const token = getToken();
    const role = [getRole()];  //data dicek

    const isAllowed = user.some(user => role.includes(user));

    if (token != null) {
        if (!isAllowed) {
            sessionStorage.clear();
            return <Navigate to="/login" replace />;
        }else{
            return <Outlet/>;
        }
    }else{
        return <Navigate to="/login" replace />;
    } 
};

const RoutePage = () => {

    const users = ['guru','siswa'];
    const admin = ['admin-absensi']

    return (
    <StyleRoot>
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />

                {/* Admin */}
                <Route element={<ProtectedRoute user={admin} />}>
                    <Route path="/admin" element={<Home />} />
                    <Route path="/about" element={<About />} />

                    <Route path="/profile" element={<ProfilePage />} />

                    <Route path="/setting/libur" element={<LiburIndex />} />
                    <Route path="/setting/jadwal-siswa" element={<JadwalSiswa />} />
                    <Route path="/setting/jadwal-guru" element={<JadwalGuru />} />

                    <Route path="/izin/siswa" element={<IzinSiswa />} />
                    <Route path="/izin/guru" element={<IzinGuru />} />

                    <Route path="/kehadiran/guru" element={<KehadiranGuru />} />
                    <Route path="/kehadiran/siswa" element={<KehadiranSiswa />} />

                    <Route path="/kehadiran/rekap-siswa" element={<RekapKehadiranSiswa />} />
                    <Route path="/kehadiran/rekap-guru" element={<RekapKehadiranGuru />} />

                    <Route path="/master/admin" element={<AdminIndex />} />
                    <Route path="/master/siswa" element={<SiswaIndex />} />
                    <Route path="/master/guru" element={<GuruIndex />} />
                    <Route path="/master/jurusan" element={<JurusanIndex />} />
                    <Route path="/master/kelas" element={<KelasIndex />} />
                    <Route path="/master/rombel" element={<RombelIndex />} />
                    <Route path="/master/tahun-ajar" element={<TahunAjarIndex />} />
                </Route>

                {/* Siswa */}
                <Route element={<ProtectedRoute user={users} />}>
                    <Route path="/profil" element={<ProfileUser />} />
                    <Route path="/" element={<DashboardSiswa />} />

                    <Route path="/izin" element={<RekapIzinUser />} />
                    <Route path="/kehadiran" element={<RekapKehadiranUser />} />
                </Route>

                <Route path="*" element={<PageNotFound />} />

            </Routes>
        </Router>
    </StyleRoot>
    )
}

export default Radium(RoutePage);
// export default RoutePage