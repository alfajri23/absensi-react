
const headers_auth = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-CSRF-TOKEN': csrf_token,
    'Authorization': 'Bearer ' + localStorage.getItem('access_token')
}

export {
    headers_auth
}