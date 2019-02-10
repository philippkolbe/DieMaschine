const Matchday = require('./Matchday');
const Handler = require('./Handler');
const FileUpdater = require('./FileUpdater');

module.exports.createSeason = async (year, matches, areStandingsNeeded) => {
    //console.log("createSeason()");
    let season = new Season(year, matches, areStandingsNeeded);
    await season.createMatchdays(year, matches, areStandingsNeeded);
    return season;
}

class Season {
    constructor(year, matches, areStandingsNeeded) {
        //console.log("Creating new season: " + year);
        this.year = year;
        this.matchdays = [];
    }

    async createMatchdays(year, matches, areStandingsNeeded) {
        const seasonWithoutStandings = await this.getSeasonWithoutStandings(year);
        //console.log("Season Creating Matchdays: " + ((areStandingsNeeded != false) ? "standingsNeeded" : "standingsNOTNeeded"));
        for (let matchDayNr = 0; matchDayNr < 34; matchDayNr++) {
            let matchdayMatches = this.getMatchDayMatches(matches, matchDayNr);

            if (matchdayMatches.length > 0)
                this.matchdays.push(await Matchday.createMatchday(year, matchDayNr + 1, matchdayMatches, areStandingsNeeded, seasonWithoutStandings));
        }
    }

    async getSeasonWithoutStandings(year) {
        const seasonHandler = new Handler.SeasonHandler(year, year, false);
        return await FileUpdater(seasonHandler);
    }

    getMatchDayMatches(matches, matchDayNr) {
        let matchdayMatches = [];

        for (let matchNr = 0; matchNr < 9; matchNr++) {
            let m = matches[matchDayNr*9 + matchNr];
            if (m.MatchIsFinished)
                matchdayMatches.push(m);
        }

        return matchdayMatches;
    }
}