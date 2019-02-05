const Season = require('./Season');
const Matchday = require('./Matchday');
const fs = require('./FileSystem');
const Openliga = require('./Openliga');

function isUpdateNeeded(obj) {
    return (Date.now() - obj.updateDate > 24*60*60*1000);
}

function createObj(content) {
    return {
        lastUpdateDate: Date.now(),
        content: content
    };
}

module.exports.handleSeveralRequests = async (handler) => {
    try {
        let arr = [];
        console.log(handler);
        for (handler.i = handler.start; handler.i <= handler.end; handler.i++) {
            let data = await module.exports.handleRequest(handler);
            arr.push(JSON.parse(data));
        }
            
        return JSON.stringify(arr);
    } catch (err) {
        console.log(err);
    }
};

module.exports.handleRequest = async (handler) => {
    try {
        let savedFile;

        if (fs.isFileCreated(handler.fileName)) {
            savedFile = fs.getSavedFile(handler.fileName);
        }

        if (savedFile == undefined || isUpdateNeeded(savedFile)) {
            let content = await handler.getContent();
            let obj = createObj(content);

            fs.writeFile(handler.fileName, JSON.stringify(obj));

            return JSON.stringify(obj.content);
        } else {
            return JSON.stringify(savedFile.content);
        }
    } catch (err) {
        console.log(err);
    }
};

module.exports.SeasonHandler = class {
    constructor(start, end) {
        this.start = this.isValidStart(start);
        console.log(start, this.start);
        this.end = this.isValidEnd(end);
        console.log(end, this.end);
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
        return "Season " + this.i;
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

        if (int < 1)
            return 1;
        else if (int > 34)
            return 34;

        return int;
    }

    get fileName() {
        return "Season " + this.season + " Matchday " + this.i;
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

function getThisSeasonYear() {
    let d = new Date();
    let currentYear = d.getFullYear();
    
    if (d.getMonth() > 5)
        return currentYear;
    else
        return currentYear - 1;
}