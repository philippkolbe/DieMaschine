let text = "";
foo();

async function foo() {
    try {
        text = await httpGetAsync();
        document.getElementById("p").innerHTML = text;
    } catch (err) {
        console.log(err);
    }
}

function httpGetAsync() {
    return new Promise((resolve, reject) => {
        var http = new XMLHttpRequest();
        var url = 'http://localhost:3000';
        var params = 'start=2002&end=2018';
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