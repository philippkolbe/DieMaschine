const Match = require('./Match');
const Handler = require('./Handler');
const FileUpdater = require('./FileUpdater');

module.exports.createMatchday = async (seasonYear, matchdayNr, matchdayMatches, areStandingsNeeded, seasonMatchdays) => {
    //console.log("CreateMatchday(): "  + ((areStandingsNeeded != false) ? "standingsNeeded" : "standingsNOTNeeded"));
    let md = new Matchday(seasonYear, matchdayNr, matchdayMatches, areStandingsNeeded, seasonMatchdays);

    if (areStandingsNeeded != false)
        await md.createStandings(seasonYear, matchdayNr, seasonMatchdays);

    return md;
};

class Matchday {
    constructor(seasonYear, matchdayNr, matchdayMatches, areStandingsNeeded, seasonMatches) {
        //console.log("Creating new matchday: " + matchdayNr);
        this.matchDayNr = matchdayNr;
        this.matches = matchdayMatches.map(m => new Match(m));
    }

    async createStandings(seasonYear, matchdayNr, seasonMatchdays) {
        //console.log("Creating standings");
        let promiseArr = ['', 'Home', 'Away', 'Form']
            .map((str) => {
                const handler = new Handler[str + 'StandingsHandler'](seasonYear, matchdayNr, seasonMatchdays);
                return FileUpdater(handler);
            });
        [
            this.standings,
            this.homeStandings,
            this.awayStandings,
            this.formStandings
        ] = await Promise.all(promiseArr);
    }
}