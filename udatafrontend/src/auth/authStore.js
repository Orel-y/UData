

export const saveToken = (Token,expiresIn)=>{
    const expiryTime = Date.now() + expiresIn * 1000;

    localStorage.setItem("uDataToken",Token);
    localStorage.setItem("tokenExpiry",expiryTime);
}

export const isTokenValid = ()=>{
    const token = localStorage.getItem("uDataToken");
    const expiry = localStorage.getItem("tokenExpiry");

    if (!token || !expiry) return false;

    return Date.now() < Number(expiry);
}
export const clearToken = ()=>{
    localStorage.removeItem("uDataToken");
    localStorage.removeItem("tokenExpiry");
}