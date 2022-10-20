import { getToken } from "../auth/auth"

const headers_auth = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-CSRF-TOKEN': csrf_token,
    'Authorization': 'Bearer ' + getToken()
}

export {
    headers_auth
}