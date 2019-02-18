const CurrentGetter = require('./CurrentGetter');

module.exports.isValidSeason = (params, defaultNr) => {
    let season = findSeason(params);
    return validateSeason(season, defaultNr);
}

module.exports.isValidStartSeason = (params, defaultNr) => {
    let season = findStartSeason(params);
    return validateSeason(season, defaultNr);
}

module.exports.isValidEndSeason = (params, defaultNr) => {
    let season = findEndSeason(params);
    return validateSeason(season, defaultNr);
}

function validateSeason(season, defaultNr) {
    console.log("BeforeSeasonValidation: " + season);
    let thisSeasonYear = CurrentGetter.getThisSeasonYear();
    let int = parseInt(season);

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

function findSeason(params) {
    return params.season || params.Season || params.seasonYear || params.SeasonYear || params.year || params.Year;
}

function findStartSeason(params) {
    return params.start || params.Start || params.startSeason || params.StartSeason || params.startYear || params.StartYear || params.startSeasonYear || params.StartSeasonYear;
}

function findEndSeason(params) {
    return params.end || params.End || params.endSeason || params.EndSeason || params.endYear || params.EndYear || params.endSeasonYear|| params.EndSeasonYear;
}

module.exports.isValidMatchday = (params, defaultNr) => {
    let matchday = findMatchday(params);
    return validateMatchday(matchday, defaultNr);
}

module.exports.isValidStartMatchday = (params, defaultNr) => {
    let matchday = findStartMatchday(params);
    return validateMatchday(matchday, defaultNr);
}

module.exports.isValidEndMatchday = (params, defaultNr) => {
    let matchday = findEndMatchday(params);
    return validateMatchday(matchday, defaultNr);
}

function validateMatchday(matchday, defaultNr) {
    console.log("Before Matchday Validation: " + matchday);
    let int = parseInt(matchday);
    if (Number.isInteger(int)) {
        if (int < 1)
            return 1;
        else if (int > 34)
            return 34;
        else
            return int;
    } else {
        //console.log("default: " + JSON.stringify(defaultNr));
        return defaultNr || 34;
    }
} 

function findMatchday(params) {
    return params.matchday || params.Matchday || params.matchdayNr || params.MatchdayNr || params.md || params.Md || params.mdNr || params.MdNr;
}

function findStartMatchday(params) {
    return params.start || params.Start || params.startMatchday || params.StartMatchday || params.startMatchdayNr || params.StartMatchdayNr || params.startMd || params.StartMd || params.startMdNr || params.StartMdNr;
    
}

function findEndMatchday(params) {
    return params.end || params.End || params.endMatchday || params.EndMatchday || params.endMatchdayNr || params.EndMatchdayNr || params.endMd || params.EndMd || params.endMdNr || params.EndMdNr;
}
