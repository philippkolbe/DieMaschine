const Match = require('./Match');
const Handler = require('./Handler');
const FileUpdater = require('./FileUpdater');
const Season = require('./Season');

module.exports.createMatchday = async (seasonYear, matchdayNr, matchdayMatches, isTableNeeded, season) => {
    //console.log("CreateMatchday(): "  + ((isTableNeeded != false) ? "tableNeeded" : "tableNOTNeeded"));
    let md = new Matchday(seasonYear, matchdayNr, matchdayMatches, isTableNeeded, season);

    if (isTableNeeded != false)
        await md.createTable(seasonYear, matchdayNr, season);

    return md;
};

class Matchday {
    constructor(seasonYear, matchdayNr, matchdayMatches, areTableNeeded, season) {
        //console.log("Creating new matchday: " + matchdayNr);
        this.matchdayNr = matchdayNr;
        this.matches = matchdayMatches.map(m => new Match(m));
    }

    async createTable(seasonYear, matchdayNr, season) {
        if (!season)
            season = await Season.createSeasonWithoutTable(seasonYear);
        //console.log("Matchday.createTable: " + season.matchdays.length);
        let promiseArr = [Handler.createTableHandler, Handler.createHomeTableHandler, Handler.createAwayTableHandler, Handler.createFormTableHandler]
            .map(async (createHandler) => {
                const handler = await createHandler({seasonYear, matchdayNr}, season);
                return FileUpdater(handler);
            });
        [
            this.table,
            this.homeTable,
            this.awayTable,
            this.formTable
        ] = await Promise.all(promiseArr);
    }
}