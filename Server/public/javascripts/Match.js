class Match {
    constructor(match) {
        //console.log("Creating new match: " + match.MatchID);

        this.teams = [new Team(match, 0),
            new Team(match, 1)
        ];
        if (match.MatchIsFinished) {
            this.pointsTeam1 = match.MatchResults[0].PointsTeam1;
            this.pointsTeam2 = match.MatchResults[0].PointsTeam2;
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