let Match = require('./Match');
let Openliga = require('./Openliga');

class Matchday {
    constructor(matchDayNr, matchdayMatches) {
        this.matchDayNr = matchDayNr;
        this.matches = [];
        
        for (let m of matchdayMatches) {
            this.matches.push(new Match(m));
        }
    }
}

module.exports = Matchday;

module.exports.createMatchday = async (year, matchdayNr) => {
    return new Matchday(matchDayNr, await Openliga(year, matchdayNr));
}