const Season = require('./Season');
const Matchday = require('./Matchday');
const fs = require('./FileSystem');
const Openliga = require('./Openliga');

module.exports.getSeasons = async (start, end) => {
    try {
        let allSeasons = [];

        for (let year = start; year <= end; year++) {
            let savedSeason;

            if (await fs.isFileCreated("Season " + year)) {//name
                savedSeason = await JSON.parse(fs.getSavedFile("Season " + year));
            }

            if (savedSeason == undefined || isUpdateNeeded(savedSeason)) {
                let seasonObj = await createObj(new Season(year, JSON.parse(await Openliga(year))));//func
                fs.writeFile("Season " + year, JSON.stringify(season));

                allSeasons.push(seasonObj.content);
            } else {
                allSeasons.push(savedSeason.content);
            }
        }

        return allSeasons;
    } catch(err) {
        console.log(err.message);
    }
}

module.exports.getMatchday = async (year, matchdayNr) => {
    try {
        let savedSeason;

        if (await fs.isFileCreated("Season " + year)) {
            savedSeason = await JSON.parse(fs.getSavedFile("Season " + year));
        }

        if (savedSeason == undefined || isUpdateNeeded(savedSeason)) {
            return await Matchday.createMatchday(year, matchdayNr);
        } else {
            return savedSeason.content[matchdayNr - 1];
        }
    } catch(err) {
        console.log(err.message);
    }
}

module.exports.getCurrentMatchday = async () => {
    try {
        let savedCurrentMatchday;

        if (await fs.isFileCreated("currentMatchday")) {
            savedCurrentMatchday = await JSON.parse(fs.getSavedFile("currentMatchday"));
        }

        if (savedSeason == undefined || isUpdateNeeded(savedCurrentMatchday)) {
            let currentMatchdayObj = createObj(await Openliga.getCurrentMatchday);

            fs.writeFile("currentMatchday", JSON.stringify(currentMatchdayObj));

            return currentMatchdayObj.content;
        } else {
            return savedCurrentMatchday.content;
        }
    } catch(err) {
        console.log(err.message);
    }
}

module.exports.getCurrentMatchdayNr = async () => {
    try {
        let savedCurrentMatchdayNr;

        if (await fs.isFileCreated("currentMatchdayNr")) {
            savedCurrentMatchdayNr = await JSON.parse(fs.getSavedFile("currentMatchdayNr"));
        }

        if (savedSeason == undefined || isUpdateNeeded(savedCurrentMatchdayNr)) {
            let currentMatchdayNrObj = createObj(await Openliga.getCurrentMatchdayNr);

            fs.writeFile("currentMatchdayNr", JSON.stringify(currentMatchdayNrObj));

            return currentMatchdayNrObj.content;
        } else {
            return savedCurrentMatchdayNr.content;
        }
    } catch(err) {
        console.log(err.message);
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