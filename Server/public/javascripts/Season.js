const Matchday = require('./Matchday');

class Season {
    constructor(year, matches) {
        console.log("Creating Season " + year);
        this.year = year;
        this.matchDays = [];

        for (let matchDayNr = 0; matchDayNr < matches.length/9; matchDayNr++) {
            let matchdayMatches = [];

            for (let matchNr = 0; matchNr < 9; matchNr++) {
                if (matches[matchDayNr*9 + matchNr].MatchIsFinished)
                matchdayMatches.push(matches[matchDayNr*9 + matchNr]);
            }

            this.matchDays.push(new Matchday(matchDayNr, matchdayMatches));
        }
    }
}

module.exports = Season;