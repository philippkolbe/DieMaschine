let Match = require('./Match');

class Matchday {
    constructor(matchDayNr, matchdayMatches) {
        //console.log("Creating new matchday: " + matchDayNr);
        this.matchDayNr = matchDayNr;
        this.matches = [];
        
        this.matches = matchdayMatches.map(m => new Match(m));
    }
}

module.exports = Matchday;