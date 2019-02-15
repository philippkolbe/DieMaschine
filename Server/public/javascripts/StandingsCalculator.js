const FileUpdater = require('./FileUpdater');
const Handler = require('./Handler');
const Standings = require('./Standings');

module.exports.calculateStandings = async function(seasonYear, matchdayNr, season, nrOfGames, config) {
    /*if (seasonYear == 2004 && matchdayNr == 1)
        console.log("calcStandings1: " + JSON.stringify(matchdays));*/
    console.log("Calcing Standings " + seasonYear + ", " + matchdayNr + " " + getTypeOfStandings(nrOfGames, config) + " Matchdays length1: " + season.matchdays.length);
    season = season || [];
    nrOfGames = nrOfGames || 34;
    config = config || {};

    //console.log("Calculating Standings " + seasonYear + " " + matchdayNr + ": " + getTypeOfStandings(nrOfGames, config));
    /*if (seasonYear == 2004 && matchdayNr == 1)
        console.log("calcStandings2: " + JSON.stringify(matchdays));*/   
    if (season.length == 0) {
        season = await getMatchdays(seasonYear);
        season = spliceUnneeded(season, matchdayNr, nrOfGames);
        console.log("New matchdays needed: " + season.length);
    }

    //console.log("Got Matchdays: " + matchdays.length);
    let standings = new Standings(season, config);

    return standings.standings;
}

async function getMatchdays(seasonYear) {
    const handler = new Handler.SeasonHandler(seasonYear, seasonYear, false);
    let season = await FileUpdater(handler);
    
    //console.log("SeasonMatchdays: " + season.matchdays.length);
    return season.matchdays;
}

function spliceUnneeded(matchdays, matchdayNr, nrOfGames) {
    if (matchdayNr)
        matchdays = matchdays.splice(0, matchdayNr);
    //console.log("after matchdaynrsplice" + matchdays.length);
    if (nrOfGames)
        matchdays = matchdays.splice(-nrOfGames, nrOfGames);
    //console.log("after formsplice: " + matchdays.length);
    return matchdays;
}

function getTypeOfStandings(nrOfGames, config) {
    if (nrOfGames < 34)
        return "form";
    else if (config == undefined)
        return "normal";
    else if (config.home)
        return "home";
    else if (config.away)
        return "away";
}