const TableTeam = require('./TableTeam');

module.exports = class {
    constructor(season, config) {
        //console.log("Creating Table: mds length: " + season.matchdays.length);
        this.table = [];
        this.setup(season);
        //console.log("config: " + JSON.stringify(config));
        this.calculate(season, config);
        this.table.sort(this.sort);
    }

    setup(season) {
        season.matchdays[0].matches.forEach(m => {
            m.teams.forEach(t => this.table.push(new TableTeam(t)));
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
        //console.log("matchdaysNr : " + mdNr);
        //console.log("matchNr: " + mNr);
    } 

    calcMatch(match, config) {
        for (let teamNr = 0; teamNr < 2; teamNr++) {
            if (config.home && teamNr != 0 || config.away && teamNr != 1)
                continue;
            let stats = this.calcStats(match, teamNr);
            let teamIdx = this.table.findIndex(t => t.name == match.teams[teamNr].name);
            /*if (teamNr == 0 && match.teams[0].shortName == "FCB" || teamNr == 1 && match.teams[1].shortName == "FCB")
                console.log(match.teams[0].shortName, match.teams[1].shortName, match.result[0], match.result[1], JSON.stringify(stats));*/
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
        this.table[idx].addPoints(stats.points); 
        this.table[idx].addGoals(stats.goals); 
        this.table[idx].addGoalsAgainst(stats.goalsAgainst); 
        this.table[idx].addGame();
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