import api_url from './url'
import axios from 'axios';


const url_login = `${api_url}/api/auth/login`;

const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-CSRF-TOKEN': csrf_token
}


const login = (user) => {
    let data = JSON.stringify(user);

    return axios.post(url_login, user,{ headers: headers })
        .then(res => {
            return res.data;
        })
        .catch(function (error) {
            return error.response.data
        });
        
}

export {login}