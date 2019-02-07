const FileUpdater = require('./FileUpdater');
const Handler = require('./Handler');
const Standings = require('./Standings');

module.exports = async function(season, matchday, nrOfGames, config) {
    nrOfGames = nrOfGames || 34;
    config = config || {};

    const handler = new Handler.MatchdayHandler(season, 1, matchday);
    let matchdays = [];
    for (handler.i = handler.start; handler.i <= handler.end; handler.i++) {
        matchdays.push(await FileUpdater(handler));
    }
    
    matchdays = matchdays.splice(-nrOfGames, nrOfGames);
    let standings = new Standings(matchdays, config);

    return standings;
}