class Match {
    constructor(match) {
        //console.log("Creating new match: " + match.MatchID);

        this.teams = [
            new Team(match, 0),
            new Team(match, 1)
        ];
        if (match.MatchIsFinished) {
            const endResultIdx = match.MatchResults.findIndex((mr => {
                return mr.ResultName == "Endergebnis" || mr.ResultTypeID == 2;
            }));
            this.result = [
                match.MatchResults[endResultIdx].PointsTeam1,
                match.MatchResults[endResultIdx].PointsTeam2
            ];
        }
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