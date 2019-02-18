const Matchday = require('./Matchday');
const Handler = require('./Handler');
const FileUpdater = require('./FileUpdater');

module.exports.createSeason = async (year, matches, isTableNeeded) => {
    //console.log("createSeason()");
    let season = new Season(year, matches, isTableNeeded);
    await season.createMatchdays(year, matches, isTableNeeded);
    season.getTable();
    return season;
}

class Season {
    constructor(year, matches, isTableNeeded) {
        //console.log("Creating new season: " + year);
        this.year = year;
        this.matchdays = [];
        this.table = [];
        this.homeTable = [];
        this.awayTable = [];
        this.formTable = [];
    }

    async createMatchdays(year, matches, isTableNeeded) {
        let seasonWithoutTable;
        if (isTableNeeded != false) {//Calcing season without table for table
            seasonWithoutTable = await module.exports.createSeasonWithoutTable(year);
        }

        //console.log("Season Creating Matchdays: " + ((isTableNeeded != false) ? "tableNeeded" : "tableNOTNeeded"));
        let promiseArr = [];

        for (let matchDayNr = 0; matchDayNr < 34; matchDayNr++) {
            let matchdayMatches = this.getMatchdayMatches(matches, matchDayNr);
            //console.log("Season.createMatchdays: " + seasonWithoutTable.matchdays.length);
            if (matchdayMatches.length > 0)
                promiseArr.push(Matchday.createMatchday(year, matchDayNr + 1, matchdayMatches, isTableNeeded, seasonWithoutTable));
        }

        this.matchdays = await Promise.all(promiseArr);
    }

    getTable() {
        const lastMd = this.matchdays[this.matchdays.length - 1];
        
        this.table = lastMd.table;
        this.homeTable = lastMd.homeTable;
        this.awayTable = lastMd.awayTable;
        this.formTable = lastMd.formTable;
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

module.exports.createSeasonWithoutTable = async (year) => {
    const seasonHandler = await Handler.createSeasonHandler({season: year}, false);
    const season = await FileUpdater(seasonHandler);
    //console.log("Season.getSeasonWithoutTable: " + season.matchdays.length);
    return season;
}