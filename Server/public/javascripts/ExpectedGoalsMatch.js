class ExpectedGoalsMatchday {
	constructor(data) {
		this.season = data.seasonNr;
		this.matchdayNr = data.matchdayNr;
		this.matches = data.matches.map(m => {
			console.log(
				`${m.homeTeamName} - ${m.awayTeamName} | ${m.homeTeamExpectedGoals}:${m.awayTeamExpectedGoals}`
			);
			return {
				teams: {home: m.homeTeamName, away: m.awayTeamName},
				expectedResult: {home: m.homeTeamExpectedGoals, away: m.awayTeamExpectedGoals}
			};
		});
	}
}

module.exports = ExpectedGoalsMatchday;
