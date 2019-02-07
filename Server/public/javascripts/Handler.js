const Openliga = require('./Openliga');
const Season = require('./Season');
const Matchday = require('./Matchday');
const StandingsCalculator = require('./StandingsCalculator');

module.exports.SeasonHandler = class {
    constructor(start, end) {
        this.start = this.isValidStart(start);
        this.end = this.isValidEnd(end);
    }

    isValidStart(nr) {
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
            return 2004;
    }

    isValidEnd(nr) {
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
            return this.start;
    }

    get fileName() {
        return `Season ${ this.i }`;
    }

    async getContent() {
        return new Season(this.i, await Openliga.getSeason(this.i));
    }
};

module.exports.MatchdayHandler = class {
    constructor(season, start, end) {
        this.season = this.isSeasonValid(season);
        this.start = this.isStartValid(start);
        this.end = this.isEndValid(end);
    }

    isSeasonValid(nr) {
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
            return thisSeasonYear;
    }

    isStartValid(nr) {
        let int = parseInt(nr);
        if (Number.isInteger(int)) {
            if (int < 1)
                return 1;
            else if (int > 34)
                return 34;
            else
                return int;
        } else
            return 1;
    }

    isEndValid(nr) {
        let int = parseInt(nr);
        if (Number.isInteger(int)) {
            if (int < 1)
                return 1;
            else if (int > 34)
                return 34;
            else
                return int;
        } else
            return 34;
    }

    get fileName() {
        return `Season ${ this.season } Matchday ${ this.i }`;
    }

    async getContent() {
        return new Matchday(this.i, await Openliga.getMatchday(this.season, this.i));
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
    constructor(season, matchday) {
        this.season = season;
        this.matchday = matchday;
    }

    async getContent() {
        return StandingsCalculator(this.season, this.matchday);
    }

    get fileName()  {
        return `Season ${ this.season } ${ this.matchday } Standings`;
    }
};

module.exports.HomeStandingsHandler = class {
    constructor(season, matchday) {
        this.season = season;
        this.matchday = matchday;
    }

    async getContent() {
        return StandingsCalculator(this.season, this.matchday, 34, {home: true});
    }

    get fileName()  {
        return `Season ${ this.season } ${ this.matchday } Homestandings`;
    }
};

module.exports.AwayStandingsHandler = class {
    constructor(season, matchday) {
        this.season = season;
        this.matchday = matchday;
    }

    async getContent() {
        return StandingsCalculator(this.season, this.matchday, 34, {away: true});
    }

    get fileName()  {
        return `Season ${ this.season } ${ this.matchday } Awaystandings`;
    }
};

module.exports.FormStandingsHandler = class {
    constructor(season, matchday) {
        this.season = season;
        this.matchday = matchday;
    }

    async getContent() {
        return StandingsCalculator(this.season, this.matchday, 5);
    }

    get fileName()  {
        return `Season ${ this.season } ${ this.matchday } Formstandings`;
    }
};

function getThisSeasonYear() {
    let d = new Date();
    let currentYear = d.getFullYear();
    
    if (d.getMonth() > 5)
        return currentYear;
    else
        return currentYear - 1;
}