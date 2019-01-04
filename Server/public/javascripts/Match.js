class Match {
    constructor(match) {
        this.team0 = new Team(match, 0);
        this.team1 = new Team(match, 1);
        
        this.pointsTeam1 = match.MatchResults[0].PointsTeam1;
        this.pointsTeam2 = match.MatchResults[0].PointsTeam2;
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