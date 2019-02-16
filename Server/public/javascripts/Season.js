const Matchday = require('./Matchday');
const Handler = require('./Handler');
const FileUpdater = require('./FileUpdater');

module.exports.createSeason = async (year, matches, areStandingsNeeded) => {
    //console.log("createSeason()");
    let season = new Season(year, matches, areStandingsNeeded);
    await season.createMatchdays(year, matches, areStandingsNeeded);
    season.getStandings();
    return season;
}

class Season {
    constructor(year, matches, areStandingsNeeded) {
        console.log("Creating new season: " + year);
        this.year = year;
        this.matchdays = [];
        this.standings = [];
        this.homeStandings = [];
        this.awayStandings = [];
        this.formStandings = [];
    }

    async createMatchdays(year, matches, areStandingsNeeded) {
        let seasonWithoutStandings;
        if (areStandingsNeeded != false) {//Calcing season without standings for standings
            seasonWithoutStandings = await module.exports.createSeasonWithoutStandings(year);
        }

        console.log("Season Creating Matchdays: " + ((areStandingsNeeded != false) ? "standingsNeeded" : "standingsNOTNeeded"));
        let promiseArr = [];

        for (let matchDayNr = 0; matchDayNr < 34; matchDayNr++) {
            let matchdayMatches = this.getMatchdayMatches(matches, matchDayNr);
            //console.log("Season.createMatchdays: " + seasonWithoutStandings.matchdays.length);
            if (matchdayMatches.length > 0)
                promiseArr.push(Matchday.createMatchday(year, matchDayNr + 1, matchdayMatches, areStandingsNeeded, seasonWithoutStandings));
        }

        this.matchdays = await Promise.all(promiseArr);
    }

    getStandings() {
        const lastMd = this.matchdays[this.matchdays.length - 1];
        
        this.standings = lastMd.standings;
        this.homeStandings = lastMd.homeStandings;
        this.awayStandings = lastMd.awayStandings;
        this.formStandings = lastMd.formStandings;
    }

    getMatchdayMatches(matches, matchDayNr) {
        let matchdayMatches = [];
        //console.log(JSON.stringify(matches));
        for (let matchNr = 0; matchNr < 9; matchNr++) {
            let m = matches[matchDayNr*9 + matchNr];
            if (m.MatchIsFinished)
                matchdayMatches.push(m);
        }
        return matchdayMatches;
    }
}

module.exports.createSeasonWithoutStandings = async (year) => {
    const seasonHandler = new Handler.SeasonHandler(year, year, false);
    const season = await FileUpdater(seasonHandler);
    console.log("Season.getSeasonWithoutStandings: " + season.matchdays.length);
    return season;
}