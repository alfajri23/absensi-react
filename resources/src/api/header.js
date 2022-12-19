import { getToken } from "../auth/auth"

const headers_auth = () => { 
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
        'Accept': 'application/json',
        //'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8',
        'Content-Type': 'application/json',
        //'X-CSRF-TOKEN': csrf_token,
        'Authorization': `Bearer ${getToken()}`
    }
}

console.log(headers_auth());

export {
    headers_auth
}