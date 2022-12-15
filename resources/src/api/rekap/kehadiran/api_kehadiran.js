import { headers_auth } from "../../header";
import api_url from "../../url";
import axios from 'axios';

const url = `${api_url}/api/v2/data/absensi/kehadiran`;

const rekapSiswa = (id_rombel, id_ta_sm) => {
    let urls = `${url}/siswa/rombel/${id_rombel}/ta_sm/${id_ta_sm}`;
    return axios.get(urls,{ headers: headers_auth()})
    .then(res => {
        return res;
    })
    .catch(function (error) {
        return error.response.data
    });
}

const rekapGuru = (id_ta_sm) => {
    let urls = `${url}/guru/ta_sm/${id_ta_sm}`;
    return axios.get(urls,{ headers: headers_auth()})
    .then(res => {
        return res;
    })
    .catch(function (error) {
        return error.response.data
    });
}

const detailRekapSiswa = (id_rombel, bulan, id_ta_sm) => {
    let urls = `${url}/detail/siswa/rombel/${id_rombel}/bulan/${bulan}/ta_sm/${id_ta_sm}`;
    return axios.get(urls,{ headers: headers_auth()})
    .then(res => {
        return res;
    })
    .catch(function (error) {
        return error.response.data
    });
}

const detailRekapGuru = (bulan, id_ta_sm) => {
    let urls = `${url}/detail/guru/bulan/${bulan}/ta_sm/${id_ta_sm}`;
    return axios.get(urls,{ headers: headers_auth()})
    .then(res => {
        return res;
    })
    .catch(function (error) {
        return error.response.data
    });
}

const getKehadiran = (id_user,role,mount,year) => {
    let urls = `${url}/user/${id_user}/role/${role}/bulan/${mount}/tahun/${year}`;
    return axios.get(urls,{ headers: headers_auth() })
    .then(res => {
        return res.data
    })
    .catch(function (error) {
        return error.response.data
    });
}

const resetDataAbsensi = (id) => {
    let urls = `${api_url}/api/v2/data/absensi/rekap/delete/ta_sm/${id}`;
    return axios.delete(urls,{ headers: headers_auth() })
    .then(res => {
        return res.data
    })
    .catch(function (error) {
        return error.response.data
    });
}

export {
    rekapGuru,
    rekapSiswa,
    detailRekapGuru,
    detailRekapSiswa,
    getKehadiran,
    resetDataAbsensi
}