const Openliga = require('./Openliga');
const Season = require('./Season');
const Matchday = require('./Matchday');
const TableCalculator = require('./TableCalculator');

const Validator = require('./Validator');
const CurrentGetter = require('./CurrentGetter');

module.exports.createSeasonsHandler = async (params, isTableNeeded) => {
    let seasonsHandler = new SeasonsHandler(params, isTableNeeded);
    await seasonsHandler.init(params, isTableNeeded);
    return seasonsHandler;
};

class SeasonsHandler {
    constructor(params, isTableNeeded) {
    }

    async init(params, isTableNeeded) {
        this.start = Validator.isValidStartSeason(params, 2004);
        console.log("After Validation start: " + this.start);
        this.end = Validator.isValidEndSeason(params, CurrentGetter.getThisSeasonYear());
        console.log("After Validation end: " + this.end);
        this.isTableNeeded = isTableNeeded;
        this.i = this.start;
    }

    get fileName() {
        return `Season ${ this.i }${ (this.isTableNeeded != false) ? '' : ' without Table'}`;
    }

    async getContent() {
        return await Season.createSeason(this.i, await Openliga.getSeason(this.i), this.isTableNeeded);
    }
};

module.exports.createSeasonHandler = async (params, isTableNeeded) => {
    let seasonHandler = new SeasonHandler(params, isTableNeeded);
    await seasonHandler.init(params, isTableNeeded);
    return seasonHandler;
};

class SeasonHandler {
    constructor(params, isTableNeeded) {
    }

    async init (params, isTableNeeded) {
        this.season = Validator.isValidSeason(params, CurrentGetter.getThisSeasonYear());
        console.log("After Validation Season: " + this.season);
        this.isTableNeeded = isTableNeeded;
    }

    get fileName() {
        return `Season ${ this.season }${ (this.isTableNeeded != false) ? '' : ' without Tables'}`;
    }

    async getContent() {
        return await Season.createSeason(this.season, await Openliga.getSeason(this.season), this.isTableNeeded);
    }
};

module.exports.createMatchdaysHandler = async (params, isTableNeeded) => {
    let matchdaysHandler = new MatchdaysHandler(params, isTableNeeded);
    await matchdaysHandler.init(params, isTableNeeded);
    return matchdaysHandler;
};

 class MatchdaysHandler {
    constructor(params, isTableNeeded) {
    }

    async init (params, isTableNeeded) {
        this.season = Validator.isValidSeason(params, CurrentGetter.getThisSeasonYear());
        console.log("After Validation season: " + this.season);
        this.start = Validator.isValidStartMatchday(params, 1);
        console.log("After Validation start: " + this.start);
        this.end = Validator.isValidEndMatchday(params, 34);
        console.log("After Validation end: " + this.end);
        this.isTableNeeded = isTableNeeded;
        this.i = this.start;
    }

    get fileName() {
        return `Season ${ this.season } Matchday ${ this.i }${ (this.isTableNeeded != false) ? '' : ' without Tables'}`;
    }

    async getContent() {
        return Matchday.createMatchday(this.season, this.i, await Openliga.getMatchday(this.season, this.i));
    }
};

module.exports.createMatchdayHandler = async (params, isTableNeeded) => {
    let matchdayHandler = new MatchdayHandler(params, isTableNeeded);
    await matchdayHandler.init(params, isTableNeeded);
    return matchdayHandler;
};

 class MatchdayHandler {
    constructor(params, isTableNeeded) {
    }

    async init(params, isTableNeeded) {
        this.season = Validator.isValidSeason(params, CurrentGetter.getThisSeasonYear());
        console.log("After Validation season: " + this.season);
        this.matchday = Validator.isValidMatchday(params, await CurrentGetter.getThisMatchday());
        console.log("After Validation matchday: " + this.matchday);
        this.isTableNeeded = isTableNeeded;
    }

    get fileName() {
        return `Season ${ this.season } Matchday ${ this.matchday }${ (this.isTableNeeded != false) ? '' : ' without Tables'}`;
    }

    async getContent() {
        return Matchday.createMatchday(this.season, this.matchday, await Openliga.getMatchday(this.season, this.matchday));
    }
};

module.exports.createCurrentMatchdayNrHandler = async () => {
    let currentMatchdayNrHandler = new CurrentMatchdayNrHandler();
    await currentMatchdayNrHandler.init();
    return currentMatchdayNrHandler;
};

class CurrentMatchdayNrHandler {
    constructor() {
    }

    async init() {
        this.fileName = "currentMatchdayNr";
    }

    async getContent() {
        let currentMatchdayNr = await Openliga.getCurrentMatchdayNr();
        console.log("CurrentMatchdayNrHandler: ", JSON.stringify(currentMatchdayNr), currentMatchdayNr.GroupOrderID)
        return currentMatchdayNr.GroupOrderID;
    }
};

module.exports.createCurrentMatchdayHandler = async () => {
    let currentMatchdayHandler = new CurrentMatchdayHandler();
    await currentMatchdayHandler.init();
    return currentMatchdayHandler;
};

 class CurrentMatchdayHandler {
    constructor() {
    }

    async init() {
        this.fileName = "currentMatchday";
    }

    async getContent() {
        let currentMatchday = await Openliga.getCurrentMatchday();
        let matchdayNr = currentMatchday[0].Group.GroupOrderID;
        return await Matchday.createMatchday(CurrentGetter.getThisSeasonYear(), matchdayNr, currentMatchday, true);
    }
};

module.exports.createTablesHandler = async (params, seasonMatches) => {
    let tablesHandler = new TablesHandler(params, seasonMatches);
    await tablesHandler.init(params, seasonMatches);
    return tablesHandler;
};

class TablesHandler {
    constructor(params, seasonMatches) {
    }

    async init(params, seasonMatches) {
        this.season = Validator.isValidSeason(params, CurrentGetter.getThisSeasonYear());
        console.log("After Validation season: " + this.season);
        this.start = Validator.isValidStartMatchday(params, 1);
        console.log("After Validation start: " + this.start);
        this.end = Validator.isValidEndMatchday(params, 34);
        console.log("After Validation end: " + this.end);
        this.seasonMatches = seasonMatches;
        this.i = this.start;
    }

    get fileName()  {
        return `Season ${ this.season } Matchday ${ this.i } Table`;
    }

    async getContent() {
        return await TableCalculator.calculateTable(this.season, this.i, this.seasonMatches);
    }
};

module.exports.createTableHandler = async (params, seasonMatches) => {
    let tableHandler = new TableHandler(params, seasonMatches);
    await tableHandler.init(params, seasonMatches);
    return tableHandler;
};

class TableHandler {
    constructor(params, seasonMatches) {
    }

    async init(params, seasonMatches) {
        this.season = Validator.isValidSeason(params, CurrentGetter.getThisSeasonYear());
        console.log("After Validation season: " + this.season);
        this.matchday = Validator.isValidMatchday(params, await CurrentGetter.getThisMatchday());
        console.log("After Validation matchday: " + this.matchday);
        this.seasonMatches = seasonMatches;
    }

    get fileName()  {
        return `Season ${ this.season } Matchday ${ this.matchday } Table`;
    }

    async getContent() {
        return await TableCalculator.calculateTable(this.season, this.matchday, this.seasonMatches);
    }
};

module.exports.createHomeTablesHandler = async (params, seasonMatches) => {
    let homeTablesHandler = new HomeTablesHandler(params, seasonMatches);
    await homeTablesHandler.init(params, seasonMatches);
    return homeTablesHandler;
};

class HomeTablesHandler {
    constructor(params, seasonMatches) {
    }

    async init(params, seasonMatches) {
        this.season = Validator.isValidSeason(params, CurrentGetter.getThisSeasonYear());
        console.log("After Validation season: " + this.season);
        this.start = Validator.isValidStartMatchday(params, 1);
        console.log("After Validation start: " + this.start);
        this.end = Validator.isValidEndMatchday(params,  34);
        console.log("After Validation end: " + this.end);
        this.seasonMatches = seasonMatches;
        this.i = this.start;
    }

    get fileName()  {
        return `Season ${ this.season } Matchday ${ this.i } Hometable`;
    }

    async getContent() {
        return await TableCalculator.calculateTable(this.season, this.i, this.seasonMatches, 34, {home: true});
    }
};

module.exports.createHomeTableHandler = async (params, seasonMatches) => {
    let homeTableHandler = new HomeTableHandler(params, seasonMatches);
    await homeTableHandler.init(params, seasonMatches);
    return homeTableHandler;
};

 class HomeTableHandler {
    constructor(params, seasonMatches) {
    }

    async init(params, seasonMatches) {
        this.season = Validator.isValidSeason(params, CurrentGetter.getThisSeasonYear());
        console.log("After Validation season: " + this.season);
        this.matchday = Validator.isValidMatchday(params, await CurrentGetter.getThisMatchday());
        console.log("After Validation matchday: " + this.matchday);
        this.seasonMatches = seasonMatches;
    }

    get fileName()  {
        return `Season ${ this.season } Matchday ${ this.matchday } Hometable`;
    }

    async getContent() {
        return await TableCalculator.calculateTable(this.season, this.matchday, this.seasonMatches, 34, {home: true});
    }
};

module.exports.createAwayTablesHandler = async (params, seasonMatches) => {
    let awayTablesHandler = new AwayTablesHandler(params, seasonMatches);
    await awayTablesHandler.init(params, seasonMatches);
    return awayTablesHandler;
};

class AwayTablesHandler {
    constructor(params, seasonMatches) {
    }

    async init(params, seasonMatches) {
        this.season = Validator.isValidSeason(params, CurrentGetter.getThisSeasonYear());
        console.log("After Validation season: " + this.season);
        this.start = Validator.isValidStartMatchday(params, 1);
        console.log("After Validation start: " + this.start);
        this.end = Validator.isValidEndMatchday(params,  34);
        console.log("After Validation end: " + this.end);
        this.seasonMatches = seasonMatches;
        this.i = this.start
    }

    get fileName()  {
        return `Season ${ this.season } Matchday ${ this.i } Awaytable`;
    }

    async getContent() {
        return await TableCalculator.calculateTable(this.season, this.i, this.seasonMatches, 34, {away: true});
    }
};

module.exports.createAwayTableHandler = async (params, seasonMatches) => {
    let awayTableHandler = new AwayTableHandler(params, seasonMatches);
    await awayTableHandler.init(params, seasonMatches);
    return awayTableHandler;
};

class AwayTableHandler {
    constructor(params, seasonMatches) {
    }

    async init(params, seasonMatches) {
        this.season = Validator.isValidSeason(params, CurrentGetter.getThisSeasonYear());
        console.log("After Validation season: " + this.season);
        this.matchday = Validator.isValidMatchday(params, await CurrentGetter.getThisMatchday());
        console.log("After Validation matchday: " + this.matchday);
        this.seasonMatches = seasonMatches;
    }

    get fileName()  {
        return `Season ${ this.season } Matchday ${ this.matchday } Awaytable`;
    }

    async getContent() {
        return await TableCalculator.calculateTable(this.season, this.matchday, this.seasonMatches, 34, {away: true});
    }
};

module.exports.createFormTablesHandler = async (params, seasonMatches) => {
    let formTablesHandler = new FormTablesHandler(params, seasonMatches);
    await formTablesHandler.init(params, seasonMatches);
    return formTablesHandler;
};

class FormTablesHandler {
    constructor(params, seasonMatches) {
    }

    async init(params, seasonMatches) {
        this.season = Validator.isValidSeason(params, CurrentGetter.getThisSeasonYear());
        console.log("After Validation season: " + this.season);
        this.start = Validator.isValidStartMatchday(params, 1);
        console.log("After Validation start: " + this.start);
        this.end = Validator.isValidEndMatchday(params,  34);
        console.log("After Validation end: " + this.end);
        this.seasonMatches = seasonMatches;
        this.i = this.start;
    }

    get fileName()  {
        return `Season ${ this.season } Matchday ${ this.i } Formtable`;
    }

    async getContent() {
        return await TableCalculator.calculateTable(this.season, this.i, this.seasonMatches, 5);
    }
};

module.exports.createFormTableHandler = async (params, seasonMatches) => {
    let formTableHandler = new FormTableHandler(params, seasonMatches);
    await formTableHandler.init(params, seasonMatches);
    return formTableHandler;
};

class FormTableHandler {
    constructor(params, seasonMatches) {
    }

    async init(params, seasonMatches) {
        this.season = Validator.isValidSeason(params, CurrentGetter.getThisSeasonYear());
        console.log("After Validation season: " + this.season);
        this.matchday = Validator.isValidMatchday(params, await CurrentGetter.getThisMatchday());
        console.log("After Validation matchday: " + this.matchday);
        this.seasonMatches = seasonMatches;
    }

    get fileName()  {
        return `Season ${ this.season } Matchday ${ this.matchday } Formtable`;
    }

    async getContent() {
        return await TableCalculator.calculateTable(this.season, this.matchday, this.seasonMatches, 5);
    }
};