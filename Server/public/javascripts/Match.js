class Match {
	constructor(seasonNr, matchdayNr, match, expectedMatch) {
		//console.log("Creating new match: " + match.MatchID);
		this.teams = {home: new Team(match, 0), away: new Team(match, 1)};

		if (match.MatchIsFinished) {
			const endResultIdx = match.MatchResults.findIndex(mr => {
				return mr.ResultName == 'Endergebnis' || mr.ResultTypeID == 2;
			});

			this.result = {
				home: match.MatchResults[endResultIdx].PointsTeam1,
				away: match.MatchResults[endResultIdx].PointsTeam2
			};

			if (expectedMatch) this.expectedResult = expectedMatch.expectedResult;
		}

		this.matchdayNr = matchdayNr;
		this.season = seasonNr;
	}
}

class Team {
	constructor(match, teamNr) {
		let teamName = 'Team' + (teamNr + 1);

		this.shortName = match[teamName].ShortName;
		this.name = match[teamName].TeamName;
		this.logo = match[teamName].TeamIconUrl;
	}
}

module.exports = Match;
