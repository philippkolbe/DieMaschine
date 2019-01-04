const Matchday = require('./Matchday');

class Season {
    constructor(year, matches) {
        //console.log("Creating new season: " + year);
        this.year = year;
        this.matchdays = [];

        for (let matchDayNr = 0; matchDayNr < 34; matchDayNr++) {
            let matchdayMatches = [];

            for (let matchNr = 0; matchNr < 9; matchNr++) {
                if (matches[matchDayNr*9 + matchNr].MatchIsFinished)
                    matchdayMatches.push(matches[matchDayNr*9 + matchNr]);
            }
            if (matchdayMatches.length > 0)
                this.matchdays.push(new Matchday(matchDayNr + 1, matchdayMatches));
        }
    }
}

module.exports = Season;