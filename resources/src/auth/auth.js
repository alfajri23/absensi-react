
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

const setTahunAjar = (data) => {
    sessionStorage.setItem("tahun_ajar", data);
}

const setTahun = (data) => {
    sessionStorage.setItem("tahun", data);
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

const getTahunAjar = () => {
    return sessionStorage.getItem("tahun_ajar");
}

const getToken = () => {
    return sessionStorage.getItem("access_token");
}

const getTahun = () => {
    return sessionStorage.getItem("tahun");
}


export{
    setCookie,
    getCookie,
    setId,setIdSekolah,setToken,setTahunAjar,setTahun,
    getId,getIdSekolah,getToken,getTahunAjar,getTahun,
}