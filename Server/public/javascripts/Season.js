const Matchday = require('./Matchday');

class Season {
    constructor(year, matches) {
        //console.log("Creating new season: " + year);
        this.year = year;
        this.matchdays = [];

        for (let matchDayNr = 0; matchDayNr < 34; matchDayNr++) {
            let matchdayMatches = getMatchDayMatches(matchDayNr);

            if (matchdayMatches.length > 0)
                this.matchdays.push(new Matchday(matchDayNr + 1, matchdayMatches));
        }
    }

    getMatchDayMatches(matchDayNr) {
        let matchdayMatches = [];

        for (let matchNr = 0; matchNr < 9; matchNr++) {
            let m = this.matches[matchDayNr*9 + matchNr];
            if (m.MatchIsFinished)
                matchdayMatches.push(m);
        }

        return matchdayMatches;
    }
}

module.exports = Season;