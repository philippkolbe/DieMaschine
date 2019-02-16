const Match = require('./Match');
const Handler = require('./Handler');
const FileUpdater = require('./FileUpdater');
const Season = require('./Season');

module.exports.createMatchday = async (seasonYear, matchdayNr, matchdayMatches, areStandingsNeeded, season) => {
    console.log("CreateMatchday(): "  + ((areStandingsNeeded != false) ? "standingsNeeded" : "standingsNOTNeeded"));
    let md = new Matchday(seasonYear, matchdayNr, matchdayMatches, areStandingsNeeded, season);

    if (areStandingsNeeded != false)
        await md.createStandings(seasonYear, matchdayNr, season);

    return md;
};

class Matchday {
    constructor(seasonYear, matchdayNr, matchdayMatches, areStandingsNeeded, season) {
        console.log("Creating new matchday: " + matchdayNr);
        this.matchDayNr = matchdayNr;
        this.matches = matchdayMatches.map(m => new Match(m));
    }

    async createStandings(seasonYear, matchdayNr, season) {
        if (!season)
            season = await Season.createSeasonWithoutStandings(seasonYear);
        console.log("Matchday.createStandings: " + season.matchdays.length);
        let promiseArr = ['', 'Home', 'Away', 'Form']
            .map((str) => {
                const handler = new Handler[str + 'StandingsHandler'](seasonYear, matchdayNr, season);
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