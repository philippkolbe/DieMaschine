const Handler = require('./Handler');
const FileUpdater = require('./FileUpdater');

module.exports.getThisSeasonYear = () => {
    let d = new Date();
    let currentYear = d.getFullYear();
    
    if (d.getMonth() > 5)
        return currentYear;
    else
        return currentYear - 1;
}

module.exports.getThisMatchday = async () => {
    let handler = await Handler.createCurrentMatchdayNrHandler();
    return await FileUpdater(handler);
}