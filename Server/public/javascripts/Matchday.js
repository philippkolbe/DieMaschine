let Match = require('./Match');
let Openliga = require('./Openliga');

class Matchday {
    constructor(matchDayNr, matchdayMatches) {
        //console.log("Creating new matchday: " + matchDayNr);
        this.matchDayNr = matchDayNr;
        this.matches = [];
        
        for (let m of matchdayMatches) {
            this.matches.push(new Match(m));
        }
    }
}

module.exports = Matchday;