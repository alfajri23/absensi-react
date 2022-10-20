import api_url from '../../url'
import axios from 'axios';
import {headers_auth} from '../../header';
import { getIdSekolah } from '../../../auth/auth';

const url = `${api_url}/api/v2/data/absensi/jadwal`;

const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-CSRF-TOKEN': csrf_token
}

const getAll = () => {
    let urls = `${url}/profile`;
    return axios.get(url,{ headers: headers })
    .then(res => {
        return res.data;
    })
    .catch(function (error) {
        return error.response.data
    });
}

const groupByHari = (role) => {
    let urls = `${url}/sekolah/${getIdSekolah()}/role/${role}`;
    return axios.get(urls,{ headers: headers })
    .then(res => {
        return res.data;
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

const updates = (id,data) => {
    let urls = `${url}/${id}`;
    return axios.put(urls,data,{ headers: headers_auth})
    .then(res => {
        return res;
    })
    .catch(function (error) {
        return error.response.data
    });
}

const detail = (id) => {
    let urls = `${url}/${id}`;
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



export{
    getAll,
    create,
    destroy,
    detail,
    updates,
    groupByHari
}