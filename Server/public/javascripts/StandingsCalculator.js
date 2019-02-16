const FileUpdater = require('./FileUpdater');
const Handler = require('./Handler');
const Standings = require('./Standings');
const Season = require('./Season');

module.exports.calculateStandings = async function(seasonYear, matchdayNr, seasonOriginal, nrOfGames, config) {
    nrOfGames = nrOfGames || 34;
    config = config || {};

    let season;
    if (!seasonOriginal) {
        season = await Season.createSeasonWithoutStandings(seasonYear);
    } else {
        season = JSON.parse(JSON.stringify(seasonOriginal));//Create copy without reference
    }

    season.matchdays = spliceUnneeded(season.matchdays, matchdayNr, nrOfGames);
    let standings = new Standings(season, config);

    return standings.standings;
}

function spliceUnneeded(matchdays, matchdayNr, nrOfGames) {
    console.log("before splice: " + matchdays.length);
    if (matchdayNr)
        matchdays = matchdays.splice(0, matchdayNr);
    console.log("after matchdaynrsplice: " + matchdays.length);
    if (nrOfGames)
        matchdays = matchdays.splice(-nrOfGames, nrOfGames);
    console.log("after formsplice: " + matchdays.length);
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