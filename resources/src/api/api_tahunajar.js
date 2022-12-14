import api_url from './url'
import axios from 'axios';
import {headers_auth} from './header';
import { getToken } from '../auth/auth';

const url = `${api_url}/api/data/master/tahun_ajaran`;

const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-CSRF-TOKEN': csrf_token
}


const getAll = () => {
    return axios.get(url,{ headers: headers_auth })
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

const setActive = (id) => {
    let urls = `${url}/set-aktif/${id}`;
    // return axios.put(urls,{ headers: headers_auth})
    // .then(res => {
    //     return res;
    // })
    // .catch(function (error) {
    //     return error.response.data
    // });

    return fetch(urls, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
        },
    })
    .then(function(res) {
        return res.json();
    })
    // // .then(function(resJson) {
    // //     return resJson;
    // // })
    .catch(function (error) {
            return error
    });
}



export{
    getAll,
    create,
    destroy,
    detail,
    updates,
    setActive
}
