import api_url from '../url'
import axios from 'axios';
import {headers_auth} from '../header';

const url = `${api_url}/api/auth`;

const getProfile = () => {
    let urls = `${url}/profile`;
    return axios.get(urls,{ headers: headers_auth })
    .then(res => {
        return res.data;
    })
    .catch(function (error) {
        return error.response.data
    });
}

const updateProfile = (data) => {
    let urls = `${url}/update-profile`;
    return axios.post(urls,data,{ headers: headers_auth })
    .then(res => {
        return res.data;
    })
    .catch(function (error) {
        return error.response.data
    });
}

const changePassword = (data) => {
    let urls = `${url}/change-password`;
    return axios.post(urls,data,{ headers: headers_auth })
    .then(res => {
        return res.data;
    })
    .catch(function (error) {
        return error.response.data
    });
}

export {
    getProfile,
    updateProfile,
    changePassword 
}

