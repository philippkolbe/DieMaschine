const FileUpdater = require('./FileUpdater');
const Handler = require('./Handler');
const Standings = require('./Standings');
const Season = require('./Season');

module.exports.calculateStandings = async function(seasonYear, matchdayNr, season, nrOfGames, config) {
    //console.log("Calcing Standings " + seasonYear + ", " + matchdayNr + " " + getTypeOfStandings(nrOfGames, config) + " Matchdays length1: " + season.matchdays.length);
    nrOfGames = nrOfGames || 34;
    config = config || {};

    //console.log("Calculating Standings " + seasonYear + " " + matchdayNr + ": " + getTypeOfStandings(nrOfGames, config));
    if (!season) {
        season = await Season.createSeasonWithoutStandings(seasonYear);
    }
    season.matchdays = spliceUnneeded(season.matchdays, matchdayNr, nrOfGames);

    //console.log("Got Matchdays: " + matchdays.length);
    let standings = new Standings(season, config);

    return standings.standings;
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
    else if (!config)
        return "normal";
    else if (config.home)
        return "home";
    else if (config.away)
        return "away";
}