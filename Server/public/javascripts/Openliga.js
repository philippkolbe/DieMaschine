const https = require('https');

module.exports.getMatchday = async (season, matchdayNr) => {
    let url = 'https://www.openligadb.de/api/getmatchdata/bl1';
    if (Number.isInteger(season)) {
        url += '/' + season;
        if (matchdayNr != undefined) {
            if (Number.isInteger(matchdayNr))
                url += '/' + matchdayNr;
            else
                return new Error("Matchday != Int");
        }

        let data = await httpRequest(url);
        //console.log("getOpenliga: " + JSON.parse(data));
        return data;
    } else {
        return new Error("Season != Int");
    }
}

module.exports.getSeason = async (season) => {
    let url = 'https://www.openligadb.de/api/getmatchdata/bl1';
    if (Number.isInteger(season)) {
        url += '/' + season;

        let data = await httpRequest(url);
        //console.log("getOpenliga: " + JSON.parse(data));
        return data;
    } else {
        return new Error("Season != Int");
    }
}

module.exports.getCurrentMatchday = async () => {
    let url = 'https://www.openligadb.de/api/getmatchdata/bl1';
    let data = await httpRequest(url);
    //console.log("getOpenliga: " + JSON.parse(data));
    return data;
}

module.exports.getCurrentMatchdayNr = async () => {
    let url = 'https://www.openligadb.de/api/getcurrentgroup/bl1';
    let data = await httpRequest(url);
    //console.log("getOpenliga: " + JSON.parse(data));
    return data;
}

async function httpRequest(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (resp) => {
            let data = '';
    
            // A chunk of data has been recieved.
            resp.on('data', (chunk) => {
                data += chunk;
                //console.log("httpRequest data: " + JSON.parse(data)[0].Group.GroupID);
            });
    
            // The whole response has been received. Print out the result.
            resp.on('end', () => {
                //console.log("httpRequest end: " + JSON.parse(data)[0].Group.GroupID);
                resolve(data);
            });
    
        }).on("error", (err) => {
            reject(new Error(err.message));
        });
    });
}