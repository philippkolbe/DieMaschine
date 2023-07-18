const https = require('https');

module.exports.getMatchday = async (season, matchdayNr) => {
	// console.log('Fetching matchday: ', season, matchdayNr);
	let url = 'https://www.openligadb.de/api/getmatchdata/bl1';
	if (Number.isInteger(season)) {
		url += '/' + season;
		if (matchdayNr != undefined) {
			if (Number.isInteger(matchdayNr)) url += '/' + matchdayNr;
			else return new Error('Matchday != Int');
		}

		let data = await httpRequest(url);
		return JSON.parse(data);
	} else {
		return new Error('Season != Int');
	}
};

module.exports.getSeason = async season => {
	// console.log('Fetching season: ', season);
	let url = 'https://www.openligadb.de/api/getmatchdata/bl1';
	if (new Number(season)) {
		url += '/' + season;

		let data = await httpRequest(url);
		return JSON.parse(data);
	} else {
		throw new Error('Season != Int');
	}
};

module.exports.getCurrentMatchday = async () => {
	// console.log('Fetching current matchday');
	let url = 'https://www.openligadb.de/api/getmatchdata/bl1';
	let data = await httpRequest(url);
	return JSON.parse(data);
};

module.exports.getCurrentMatchdayNr = async () => {
	// console.log('Fetching current matchdaynr');
	let url = 'https://www.openligadb.de/api/getcurrentgroup/bl1';
	let data = await httpRequest(url);
	return JSON.parse(data);
};

async function httpRequest(url) {
	// console.log('HTTP request: ', url);
	return new Promise((resolve, reject) => {
		https
			.get(url, resp => {
				let data = '';

				// A chunk of data has been recieved.
				resp.on('data', chunk => {
					// console.log('chunk received', chunk);
					data += chunk;
				});

				// The whole response has been received. Print out the result.
				resp.on('end', () => {
					resolve(data);
				});
			})
			.on('error', err => {
				reject(new Error(err.message));
			});
	});
}
