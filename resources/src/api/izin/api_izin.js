import api_url from '../url'
import axios from 'axios';
import {headers_auth} from '../header';
import { getTahunAjar } from '../../auth/auth';

const url = `${api_url}/api/v2/data/absensi/izin`;

const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-CSRF-TOKEN': csrf_token
}

const getIzinSiswa = (mount,year) => {
    let urls = `${url}/siswa/bulan/${mount}/tahun/${year}/ta_sm/${getTahunAjar()}`;
    return axios.get(urls,{ headers: headers_auth })
    .then(res => {
        return res.data;
    })
    .catch(function (error) {
        return error.response.data
    });
}

const getIzinGuru = (mount,year) => {
    let urls = `${url}/guru/bulan/${mount}/tahun/${year}`;
    return axios.get(urls,{ headers: headers_auth })
    .then(res => {
        return res.data
    })
    .catch(function (error) {
        return error.response.data
    });
}

const create = (data) => {
    return axios.post(url,data,{ headers: headers_auth})
    .then(res => {
        return res;
    })
    .catch(function (error) {
        return error.response.data
    });
}

const updates = (data) => {
    let urls = `${url}/info`;
    return axios.put(urls,data,{ headers: headers_auth})
    .then(res => {
        return res;
    })
    .catch(function (error) {
        return error.response.data
    });
}

const detail = (id,role) => {
    let urls = role == 'siswa' ? `${url}/${id}` : `${url}/guru/${id}`;
    return axios.get(urls,{ headers: headers_auth})
    .then(res => {
        return res;
    })
    .catch(function (error) {
        return error.response.data
    });
}

const destroy = (id) => {
    let urls = `${url}/delete/${id}`;
    return axios.delete(urls,{ headers: headers_auth})
    .then(res => {
        return res;
    })
    .catch(function (error) {
        return error.response.data
    });
}

const confirm = (data) => {
    let urls = `${url}/konfirmasi`;
    return axios.post(urls,data,{ headers: headers_auth})
    .then(res => {
        return res;
    })
    .catch(function (error) {
        return error.response.data
    });
}

const getIzin = (id_user,role,mount,year) => {
    let urls = `${url}/user/${id_user}/role/${role}/bulan/${mount}/tahun/${year}`;
    return axios.get(urls,{ headers: headers_auth })
    .then(res => {
        return res.data
    })
    .catch(function (error) {
        return error.response.data
    });
}




export{
    getIzin,
    getIzinSiswa,
    getIzinGuru,
    create,
    destroy,
    detail,
    updates,
    confirm
}
