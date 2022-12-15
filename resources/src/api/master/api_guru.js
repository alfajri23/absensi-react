import api_url from '../url'
import axios from 'axios';
import {headers_auth} from '../header';

const url = `${api_url}/api/data/user/guru`;

const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-CSRF-TOKEN': csrf_token
}

const getAll = () => {
    return axios.get(url,{ headers: headers })
    .then(res => {
        return res.data;
    })
    .catch(function (error) {
        return error.response.data
    });
}

const create = (data) => {
    return axios.post(url,data,{ headers: headers_auth()})
    .then(res => {
        return res;
    })
    .catch(function (error) {
        return error.response.data
    });
}

const updates = (data) => {
    let urls = `${url}/update_guru`;
    return axios.post(urls,data,{ headers: headers_auth()})
    .then(res => {
        return res;
    })
    .catch(function (error) {
        return error.response.data
    });
}

const detail = (id) => {
    let urls = `${url}/${id}`;
    return axios.get(urls,{ headers: headers_auth()})
    .then(res => {
        return res;
    })
    .catch(function (error) {
        return error.response.data
    });
}

const destroy = (id) => {
    let urls = `${url}/delete/${id}`;
    return axios.delete(urls,{ headers: headers_auth()})
    .then(res => {
        return res;
    })
    .catch(function (error) {
        return error.response.data
    });
}

const resetPass = (id) => {
    let urls = `${api_url}/api/password/reset-password/guru/${id}`;
    return axios.put(urls,{ headers: headers_auth()})
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
    resetPass
}
