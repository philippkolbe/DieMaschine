const FileUpdater = require('./FileUpdater');
const Handler = require('./Handler');
const Standings = require('./Standings');

module.exports.calculateStandings = async function(seasonYear, matchdayNr, matchdays, nrOfGames, config) {
    matchdays = matchdays || [];
    nrOfGames = nrOfGames || 34;
    config = config || {};

    //console.log("Calculating Standings " + seasonYear + " " + matchdayNr + ": " + getTypeOfStandings(nrOfGames, config));
    if (matchdays.length > 0) {
        matchdays = await getMatchdays(seasonYear);
        matchdays = spliceUnneeded(matchdays, matchdayNr, nrOfGames);
    }

    //console.log("Got Matchdays: " + matchdays.length);
    let standings = new Standings(matchdays, config);

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
    if (config.home)
        return "home";
    else if (config.away)
        return "away";
    else if (nrOfGames < 34)
        return "form";
    else
        return "normal";
}