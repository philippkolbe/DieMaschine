let p1, p2, p3, p4;

async function createP() {
    try {
        await makeAllHtppRequests();
        document.getElementById("p1").innerHTML = p1;
        document.getElementById("p2").innerHTML = p2;
        document.getElementById("p3").innerHTML = p3;
        document.getElementById("p4").innerHTML = p4;
    } catch (err) {
        console.log(err);
    }
}

async function makeAllHtppRequests() {
    p1 = await httpGetAsync('season', 'start=2005&end=2018');
    p2 = await httpGetAsync('matchday', 'season=2018&start=1&end=5');
    p3 = await httpGetAsync('current', '');
    p4 = await httpGetAsync('currentMatchday', '');
}

function httpGetAsync(urlEnd, params) {
    return new Promise((resolve, reject) => {
        var http = new XMLHttpRequest();
        var url = 'http://localhost:3000/' + urlEnd;
        http.open('POST', url, true);

        //Send the proper header information along with the request
        http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        http.onreadystatechange = function() {//Call a function when the state changes.
            if(http.readyState == 4 && http.status == 200) {
                resolve(http.responseText);
            }
        }
        http.send(params);
    });
}