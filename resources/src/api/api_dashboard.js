import api_url from './url'
import axios from 'axios';
import {headers_auth} from './header';
import { getToken } from '../auth/auth';

const url = `${api_url}`;

const cardDashboard = (ta_sm) => {
    let urls = `${url}/api/data/absensi/kehadiran/dashboard/ta_sm/${ta_sm}`;
    return axios.get(urls,{ headers: headers_auth()})
    .then(res => {
        return res;
    })
    .catch(function (error) {
        return error.response.data
    });
}

const statistikKehadiran = (role,id,bulan,tahun) => {
    console.log(tahun);
    let urls = `${url}/api/data/absensi/kehadiran/statistik/role/${role}/id/${id}/bulan/${bulan}/tahun/${tahun}`;
    return axios.get(urls,{ headers: headers_auth()})
    .then(res => {
        return res;
    })
    .catch(function (error) {
        return error.response.data
    });
}

const statistikKeterlambatan = (id_ta_sm) => {
    let urls = `${url}/api/v2/data/absensi/kehadiran/terlambat/ta_sm/${id_ta_sm}`;
    console.log(headers_auth())
    return axios.get(urls,{ headers: headers_auth()})
    .then(res => {
        return res;
    })
    .catch(function (error) {
        return error.response.data
    });
}

export{
    cardDashboard,
    statistikKehadiran,
    statistikKeterlambatan
}

