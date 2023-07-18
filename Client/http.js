const SEASON_YEAR = 2020;
const START_SEASON_YEAR = 2014;

const httpRequests = [
	{
		route: 'seasons',
		params: `start=${START_SEASON_YEAR}&end=${SEASON_YEAR}`,
		name: 'seasons'
	},
	{
		route: 'currentMatchday',
		params: '',
		name: 'currentMatchday'
	}
];
let httpResults;

async function makeAllHttpRequests(allDone) {
	let httpResults = {};

	httpRequests.forEach(e => {
		httpGetAsync(e.route, e.params, done);

		function done(response) {
			httpResults[e.name] = response;
			if (Object.keys(httpResults).length == httpRequests.length) {
				allDone(httpResults);
			}
		}
	});
}

function httpGetAsync(route, params, done) {
	params = params || '';
	const http = new XMLHttpRequest();
	const url = `http://localhost:3000/${route}?${params}`;
	http.open('GET', url, true);

	//Send the proper header information along with the request
	http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

	http.onreadystatechange = function() {
		//Call a function when the state changes.
		if (http.readyState == 4 && http.status == 200) {
			//console.log(http.responseText);
			done(JSON.parse(http.responseText));
		}
	};
	http.send();
}
