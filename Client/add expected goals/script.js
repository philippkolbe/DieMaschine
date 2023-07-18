function createJSONObject(s, seasonNr, mdNr) {
	let a = s.split('\n');
	if (a.length != 36) {
		console.error('Wrong input');
		return false;
	}
	let matches = [];
	for (let i = 0; i < a.length / 4; i++) {
		let nr = 4 * i;
		let homeTeamName = convertToOpenligaName(a[nr]);
		let awayTeamName = convertToOpenligaName(a[nr + 3]);
		let xScore = a[nr + 2];
		let homeTeamExpectedGoals = parseFloat(xScore.slice(0, 4));
		let awayTeamExpectedGoals = parseFloat(xScore.slice(4, 8));

		if (!Number.isNaN(homeTeamExpectedGoals) && !Number.isNaN(awayTeamExpectedGoals))
			matches.push({homeTeamName, homeTeamExpectedGoals, awayTeamName, awayTeamExpectedGoals});
	}
	updateOnServer(seasonNr, mdNr, matches);
}

function convertToOpenligaName(s) {
	switch (s) {
		case 'Schalke 04':
			return 'FC Schalke 04';
		case 'Bayern Munich':
			return 'FC Bayern München';
		case 'Freiburg':
			return 'SC Freiburg';
		case 'Nuernberg':
			return '1. FC Nürnberg';
		case 'RasenBallsport Leipzig':
			return 'RB Leipzig';
		case 'Hertha Berlin':
			return 'Hertha BSC';
		case 'Borussia M.Gladbach':
			return 'Borussia Mönchengladbach';
		case 'Fortuna Duesseldorf':
			return 'Fortuna Düsseldorf';
		case 'Wolfsburg':
			return 'VfL Wolfsburg';
		case 'Augsburg':
			return 'FC Augsburg';
		case 'Mainz 05':
			return '1. FSV Mainz 05';
		case 'Hoffenheim':
			return 'TSG 1899 Hoffenheim';
		case 'Paderborn':
			return 'SC Paderborn 07';
		case 'Union Berlin':
			return '1. FC Union Berlin';
		case 'FC Cologne':
			return '1. FC Köln';
		case 'Darmstadt':
			return 'SV Darmstadt 98';
		case 'Ingolstadt':
            return 'FC Ingolstadt 04';
        case 'Borussia Dortmund':
            return 'BV Borussia Dortmund 09';
		default:
			return s;
	}
}

function updateOnServer(seasonNr, mdNr, matches) {
	let obj = {seasonNr, mdNr, matches};

	const xhttp = new XMLHttpRequest();
	const url = `http://localhost:3000/postExpectedMatchday`;

	xhttp.open('POST', url, true);
	xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

	xhttp.onreadystatechange = () => {
		if (this.readyState == 4 && this.status == 200) {
			console.log(this.responseText);
		}
	};

	xhttp.send(`data=${JSON.stringify(obj)}`);
}
