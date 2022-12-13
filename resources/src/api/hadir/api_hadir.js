import api_url from '../url'
import axios from 'axios';
import {headers_auth} from '../header';

const url = `${api_url}/api`;

const getDataMasuk = (id_kelas) => {
    let urls = `${url}/v2/data/absensi/jadwal/today/kelas_siswa/${id_kelas}`;
    return axios.get(urls,{ headers: headers_auth })
    .then(res => {
        return res.data;
    })
    .catch(function (error) {
        return error.response.data
    });
}

const storeAbsensi = (body) => {
    let urls = `${url}/v2/data/absensi/kehadiran/siswa`;
    return axios.post(urls,body,{ headers: headers_auth })
    .then(res => {
        return res.data;
    })
    .catch(function (error) {
        return error.response.data
    });
}

export {
    getDataMasuk,
    storeAbsensi
}