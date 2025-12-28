// import * as jwt_decode_module from "jwt-decode";
// const jwtDecode = jwt_decode_module.default;

export const saveToken = (Token)=>{
    localStorage.setItem("uDataToken",Token);
}

export const isTokenValid = ()=>{
    // const token = localStorage.getItem("uDataToken");
    // const decoded = jwt_decode(token);
    // const exp = decoded.exp;
    // const now = Math.floor(Date.now() / 1000);

    // if (!token) return false;

    // if (now > exp) {
    // alert("Session expired. Please log in again.");
    // localStorage.removeItem("uDataToken");
    // window.location.href = "/login";
    // }
    return true;
}

export const getToken = ()=>{
    return localStorage.getItem("uDataToken");
}

export const clearToken = ()=>{
    localStorage.removeItem("uDataToken");
}