import React from "react";
import ReactDOM from 'react-dom/client';
import RoutePage from './route'


import * as jQuery from "jquery";


window.jQuery = jQuery;
window.$ = jQuery;

require("jquery/dist/jquery.min");
require("jquery-ui-dist/jquery-ui.min.js");
require("jquery.nicescroll/dist/jquery.nicescroll.js");
require("popper.js/dist/popper.min");
require("bootstrap/dist/js/bootstrap.min.js");
// require("bootstrap/dist/css/bootstrap.min.css");

const root = ReactDOM.createRoot(document.querySelector('#root'));
root.render(<RoutePage />);