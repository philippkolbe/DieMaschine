const Season = require('./Season');
const Matchday = require('./Matchday');
const fs = require('./FileSystem');
const Openliga = require('./Openliga');

module.exports.getSeasons = async (start, end) => {
    try {
        let allSeasons = [];

        for (let year = start; year <= end; year++) {
            if (year == 2003)
                break;
            
            let savedSeason;
            
            if (await fs.isFileCreated("Season " + year)) {//name
                savedSeason = JSON.parse(await fs.getSavedFile("Season " + year));
            }

            if (savedSeason == undefined || isUpdateNeeded(savedSeason)) {
                let seasonObj = await createObj(new Season(year, await Openliga.getSeason(year)));//func

                fs.writeFile("Season " + year, JSON.stringify(seasonObj));

                allSeasons.push(seasonObj.content);
            } else {
                allSeasons.push(savedSeason.content);
            }
        }

        return allSeasons;
    } catch(err) {
        console.log(err);
    }
}

module.exports.getMatchday = async (year, matchdayNr) => {
    try {
        let savedSeason;

        if (await fs.isFileCreated("Season " + year)) {
            savedSeason = JSON.parse(await fs.getSavedFile("Season " + year));
        }

        if (savedSeason == undefined || isUpdateNeeded(savedSeason)) {
            let matchday = new Matchday(matchdayNr, await Openliga.getMatchday(year, matchdayNr));

            return matchday;
        } else {
            return savedSeason.content.matchdays[matchdayNr - 1];
        } 
    } catch(err) {
        console.log(err);
    }
}

module.exports.getCurrentMatchday = async () => {
    try {
        let savedCurrentMatchday;

        if (await fs.isFileCreated("currentMatchday")) {
            savedCurrentMatchday = JSON.parse(await fs.getSavedFile("currentMatchday"));
        }

        if (savedCurrentMatchday == undefined || isUpdateNeeded(savedCurrentMatchday)) {
            let currentMatchdayObj = createObj(new Matchday(await Openliga.getCurrentMatchdayNr().GroupOrderID, await Openliga.getCurrentMatchday()));
            fs.writeFile("currentMatchday", JSON.stringify(currentMatchdayObj));

            return currentMatchdayObj.content;
        } else {
            return savedCurrentMatchday.content;
        }
    } catch(err) {
        console.log(err);
    }
}

module.exports.getCurrentMatchdayNr = async () => {
    try {
        let savedCurrentMatchdayNr;

        if (await fs.isFileCreated("currentMatchdayNr")) {
            savedCurrentMatchdayNr = JSON.parse(await fs.getSavedFile("currentMatchdayNr"));
        }

        if (savedCurrentMatchdayNr == undefined || isUpdateNeeded(savedCurrentMatchdayNr)) {
            let currentMatchdayNr = await Openliga.getCurrentMatchdayNr();

            let currentMatchdayNrObj = createObj(currentMatchdayNr.GroupOrderID);

            fs.writeFile("currentMatchdayNr", JSON.stringify(currentMatchdayNrObj));

            return currentMatchdayNrObj.content;
        } else {
            return savedCurrentMatchdayNr.content;
        }
    } catch(err) {
        console.log(err);
    }
}

function isUpdateNeeded(obj) {
    return (Date.now() - obj.updateDate > 86400000);//1 day
}

function createObj(content) {
    return {
        lastUpdateDate: Date.now(),
        content: content
    };
}