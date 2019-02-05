let Match = require('./Match');

class Matchday {
    constructor(matchDayNr, matchdayMatches, onlyResults) {
        //console.log("Creating new matchday: " + matchDayNr);
        this.matchDayNr = matchDayNr;
        this.matches = [];
        
        for (let m of matchdayMatches) {
            this.matches.push(new Match(m, onlyResults));
        }
    }
}

module.exports = Matchday;