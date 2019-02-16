const StandingsTeam = require('./StandingsTeam');

module.exports = class {
    constructor(season, config) {
        console.log("Creating Standings: mds length: " + season.matchdays.length);
        this.standings = [];
        this.setup(season);
        console.log("config: " + JSON.stringify(config));
        this.calculate(season, config);
        this.standings.sort(this.sort);
    }

    setup(season) {
        season.matchdays[0].matches.forEach(m => {
            m.teams.forEach(t => this.standings.push(new StandingsTeam(t)));
        });
    }

    calculate(season, config) {
        let mdNr = 0, mNr = 0; 
        season.matchdays.forEach(md => {
            md.matches.forEach(m => {
                this.calcMatch(m, config)
                mNr++;
            });
            mdNr++;
        });
        console.log("matchdaysNr : " + mdNr);
        console.log("matchNr: " + mNr);
    } 

    calcMatch(match, config) {
        for (let teamNr = 0; teamNr < 2; teamNr++) {
            if (config.home && teamNr != 0 || config.away && teamNr != 1)
                continue;
            let stats = this.calcStats(match, teamNr);
            let teamIdx = this.standings.findIndex(t => t.name == match.teams[teamNr].name);
            if (teamNr == 0 && match.teams[0].shortName == "FCB" || teamNr == 1 && match.teams[1].shortName == "FCB")
                console.log(match.teams[0].shortName, match.teams[1].shortName, match.result[0], match.result[1], JSON.stringify(stats));
            this.addStats(teamIdx, stats);
        }
    }

    calcStats(match, teamNr) {
        let stats = {};
        const opponentNr = 1 - teamNr;

        stats.goals = match.result[teamNr];
        stats.goalsAgainst = match.result[opponentNr];

        if (stats.goals > stats.goalsAgainst)
            stats.points = 3;
        else if (stats.goals < stats.goalsAgainst)
            stats.points = 0;
        else
            stats.points = 1;
        
        return stats;
    }

    addStats(idx, stats) {
        this.standings[idx].addPoints(stats.points); 
        this.standings[idx].addGoals(stats.goals); 
        this.standings[idx].addGoalsAgainst(stats.goalsAgainst); 
        this.standings[idx].addGame();
    }

    sort(a, b) {
        if (a.points < b.points)
            return 1;
        else if (a.points > b.points)
            return -1;
        else {
            if (a.goalDifference < b.goalDifference) 
                return 1;
            else if (a.goalDifference > b.goalDifference)
                return -1;
            else {
                if (a.games > b.games)
                    return 1;
                else if (a.games < b.games)
                    return -1;
                else
                    return 0;
            } 
        }
    }
}