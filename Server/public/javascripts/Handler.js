const Openliga = require('./Openliga');
const Season = require('./Season');
const Matchday = require('./Matchday');
const StandingsCalculator = require('./StandingsCalculator');

module.exports.SeasonHandler = class {
    constructor(start, end, areStandingsNeeded) {
        //console.log("Creating SeasonHandler");
        this.start = isValidSeason(start, 2004);
        this.end = isValidSeason(end);
        this.areStandingsNeeded = areStandingsNeeded;
        this.i = this.start;
    }

    get fileName() {
        return `Season ${ this.i } ${ (this.areStandingsNeeded != false) ? '' : 'without Standings'}`;
    }

    async getContent() {
        return await Season.createSeason(this.i, await Openliga.getSeason(this.i), this.areStandingsNeeded);
    }
};

module.exports.MatchdayHandler = class {
    constructor(season, start, end, areStandingsNeeded) {
        //console.log("Creating Matchday Handler");    
        this.season = isValidSeason(season);
        this.start = isValidMatchday(start, 1);
        this.end = isValidMatchday(end, 34);
        this.areStandingsNeeded = areStandingsNeeded;
        this.i = this.start;
    }

    get fileName() {
        return `Season ${ this.season } Matchday ${ this.i } ${ (this.areStandingsNeeded != false) ? '' : 'without Standings'}`;
    }

    async getContent() {
        return Matchday.createMatchday(this.season, this.i, await Openliga.getMatchday(this.season, this.i));
    }
};

module.exports.CurrentMatchdayNrHandler = class {
    constructor() {
        this.fileName = "currentMatchdayNr";
    }

    async getContent() {
        return await Openliga.getCurrentMatchdayNr();
    }
};

module.exports.CurrentMatchdayHandler = class {
    constructor() {
        this.fileName = "currentMatchday";
    }

    async getContent() {
        return await Openliga.getCurrentMatchday();
    }
};

module.exports.StandingsHandler = class {
    constructor(season, matchday, seasonMatches) {
        //console.log("Creating StandingsHandler");
        this.season = isValidSeason(season);
        this.matchday = isValidMatchday(matchday);
        this.seasonMatches = seasonMatches;
    }

    async getContent() {
        return await StandingsCalculator.calculateStandings(this.season, this.matchday, this.seasonMatches);
    }

    get fileName()  {
        return `Season ${ this.season } Matchday ${ this.matchday } Standings`;
    }
};

module.exports.HomeStandingsHandler = class {
    constructor(season, matchday, seasonMatches) {
        //console.log("Creating HomeStandingsHandler");
        this.season = isValidSeason(season);
        this.matchday = isValidMatchday(matchday);
        this.seasonMatches = seasonMatches;
    }

    async getContent() {
        return await StandingsCalculator.calculateStandings(this.season, this.matchday, this.seasonMatches, 34, {home: true});
    }

    get fileName()  {
        return `Season ${ this.season } Matchday ${ this.matchday } Homestandings`;
    }
};

module.exports.AwayStandingsHandler = class {
    constructor(season, matchday, seasonMatches) {
        //console.log("Creating AwayStandingsHandler");
        this.season = isValidSeason(season);
        this.matchday = isValidMatchday(matchday);
        this.seasonMatches = seasonMatches;
    }

    async getContent() {
        return await StandingsCalculator.calculateStandings(this.season, this.matchday, this.seasonMatches, 34, {away: true});
    }

    get fileName()  {
        return `Season ${ this.season } Matchday ${ this.matchday } Awaystandings`;
    }
};

module.exports.FormStandingsHandler = class {
    constructor(season, matchday, seasonMatches) {
        //console.log("Creating FormStandingsHandler");
        this.season = isValidSeason(season);
        this.matchday = isValidMatchday(matchday);
        this.seasonMatches = seasonMatches;
    }

    async getContent() {
        return await StandingsCalculator.calculateStandings(this.season, this.matchday, this.seasonMatches, 5);
    }

    get fileName()  {
        return `Season ${ this.season } Matchday ${ this.matchday } Formstandings`;
    }
};

function isValidSeason(nr, defaultNr) {
    let thisSeasonYear = getThisSeasonYear();
    let int = parseInt(nr);

    if (Number.isInteger(int)) {
        if (int < 2004)
            return 2004;
        else if (int > thisSeasonYear)
            return thisSeasonYear;
        else
            return int;
    } else
        return defaultNr || thisSeasonYear;
}

function isValidMatchday(nr, defaultNr) {
    let int = parseInt(nr);
    if (Number.isInteger(int)) {
        if (int < 1)
            return 1;
        else if (int > 34)
            return 34;
        else
            return int;
    } else
        return defaultNr || 34;
}

function getThisSeasonYear() {
    let d = new Date();
    let currentYear = d.getFullYear();
    
    if (d.getMonth() > 5)
        return currentYear;
    else
        return currentYear - 1;
}