var express = require('express');
var router = express.Router();
const script = require('../public/javascripts/script.js');

router.post('/seasons', async (req, res, next) => {
    let start = getStartEnd(req.body.start);
    let end = getStartEnd(req.body.end);

    console.log("Got request '/'");
    let allGames = await script.getSeasons(start, end);
    
    res.send(JSON.stringify(allGames));
});

router.post('/matchday', async (req, res, next) => {
    let start = getStartEnd(req.body.season);
    let end = getStartEnd(req.body.matchdayNr);

    console.log("Got request '/'");
    let allGames = await script.getMatchday(season, matchdayNr);
    
    res.send(JSON.stringify(allGames));
});

router.post('/current', async (req, res, next) => {
    console.log("Got request '/'");
    let allGames = await script.getCurrentMatchdayNr();
    
    res.send(JSON.stringify(allGames));
});

router.post('/currentMatchday', async (req, res, next) => {

    console.log("Got request '/'");
    let allGames = await script.getCurrentMatchday();
    
    res.send(JSON.stringify(allGames));
});

function getThisSeasonYear() {
    let d = new Date();
    let currentYear = d.getFullYear();
    
    if (d.getMonth() > 5)
        return currentYear;
    else
        return currentYear - 1;
}

function getStartEnd(startEnd) {
    if (isValid(startEnd))
        return startEnd;
    else
        return getThisSeasonYear();
}

function isValid(int) {
    return (Number.isInteger(new Number(int)) &&
        int < 2002 &&
        int > getThisSeasonYear());
}

module.exports = router;
