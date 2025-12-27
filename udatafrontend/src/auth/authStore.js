

export const saveToken = (Token)=>{
    localStorage.setItem("uDataToken",Token);
    console.log("saved");
}

export const getToken = ()=>{
    return localStorage.getItem("uDataToken");
}