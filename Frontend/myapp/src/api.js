// CallApi.js

export const BASEURL = "http://localhost:2031/";

export function callApi(reqmethod, url, data, responseHandler) {
    var option;
    if(reqmethod === "GET" || reqmethod === "DELETE") {
        option = {
            method: reqmethod, 
            headers: {'Content-Type': 'application/json'}
        };
    } else {
        option = {
            method: reqmethod, 
            headers: {'Content-Type': 'application/json'}, 
            body: data
        };
    }
    
    console.log(`Making ${reqmethod} request to: ${url}`);
    if (data) console.log("Request data:", data);
    
    fetch(url, option)
        .then(response => {
            console.log("Response status:", response.status, response.statusText);
            if(!response.ok)
                throw new Error(response.status + " " + response.statusText);
            return response.text();
        })
        .then(data => {
            console.log("Response data:", data);
            responseHandler(data);
        })
        .catch(error => {
            console.error("API Error:", error);
            alert(error);
        });
}

export function setSession(sesname, sesvalue, expday) {
    let D = new Date();
    D.setTime(D.getTime() + expday * 3600000);
    // Fixed the path/secure issue
    document.cookie = `${sesname}=${sesvalue}; expires=${D.toUTCString()}; path=/`;
    console.log(`Session set: ${sesname}=${sesvalue}`);
}

export function getSession(sesname) {
    let decodedCookie = decodeURIComponent(document.cookie);
    let cookieData = decodedCookie.split(';');
    for (let x in cookieData) {
        let trimmedCookie = cookieData[x].trim();
        // More precise matching to avoid partial matches
        if(trimmedCookie.startsWith(sesname + "=")) {
            return trimmedCookie.substring(sesname.length + 1);
        }
    }
    return "";
}