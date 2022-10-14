
function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*216000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}


const setId = (data) => {
    sessionStorage.setItem("id", data);
}

const setIdSekolah = (data) => {
    sessionStorage.setItem("id_sekolah", data);
}

const setToken = (data) => {
    sessionStorage.setItem("access_token", data);
}

const getId = () => {
    return sessionStorage.getItem("id");
}

const getIdSekolah = () => {
    return sessionStorage.getItem("id_sekolah");
}

const getToken = () => {
    return sessionStorage.getItem("access_token");
}


export{
    setCookie,
    getCookie,
    setId,setIdSekolah,setToken,
    getId,getIdSekolah,getToken,
}