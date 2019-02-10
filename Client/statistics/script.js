let standings, season;

function load() {
    try {
        makeAllHtppRequests();
    } catch (err) {
        console.log(err);
    }
}

async function makeAllHtppRequests() {
    let promiseArray = [];
    //promiseArray.push(httpGetAsync('standings'));
    promiseArray.push(httpGetAsync('season', 'start=2000&end=2020'));
    let resultArray = await Promise.all(promiseArray);
    output(resultArray);
}

function output(arr) {
    for (let e of arr) {
        console.log(e);
    }
}

function httpGetAsync(urlEnd, params) {
    params = params || "";
    return new Promise((resolve, reject) => {
        const http = new XMLHttpRequest();
        const url = `http://localhost:3000/${urlEnd}?${params}`;
        http.open('GET', url, true);

        //Send the proper header information along with the request
        http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        http.onreadystatechange = function() {//Call a function when the state changes.
            if(http.readyState == 4 && http.status == 200) {
                resolve((http.responseText));
            }
        }
        http.send();        
    });
}