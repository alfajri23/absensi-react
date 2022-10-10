import React, { useState } from "react";
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom'
import LayoutAdmin from "../layouts/admin";

const About = () => {
    return(
        <LayoutAdmin>
        <div>
            <div className="container">
                Ini halaman About
            </div>
        </div>
        </LayoutAdmin>
    )
}

export default About;