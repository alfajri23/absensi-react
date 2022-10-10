import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";

import Home from "./pages/home"
import About from "./pages/about"
import LayoutAdmin from './layouts/admin';

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
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
            </Routes>
        </Router>
    </div>
    )
}

export default RoutePage