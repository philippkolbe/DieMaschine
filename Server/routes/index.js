var express = require('express');
var router = express.Router();
const script = require('../public/javascripts/script.js');

router.post('/seasons', async (req, res, next) => { 
    //console.log("Got request '/seasons'");

    let start = parseInt(req.body.start);
    let end = parseInt(req.body.end);

    let allGames = await script.getSeasons(start, end);
    let response = JSON.stringify(allGames);
    
    //console.log("Seasons: " + response);

    res.send(response);
});

router.post('/matchday', async (req, res, next) => {
    //console.log("Got request '/matchday'");

    let season = parseInt(req.body.season);
    let matchdayNr = parseInt(req.body.matchdayNr);

    let matchday = await script.getMatchday(season, matchdayNr);
    let response = JSON.stringify(matchday);

    //console.log("Matchday: " + response);
    
    res.send(response);
});

router.post('/current', async (req, res, next) => {
    //console.log("Got request '/current'");

    let currentMatchdayNr = await script.getCurrentMatchdayNr();
    let response = JSON.stringify(currentMatchdayNr);

    //console.log("CurrentMatchdayNr: " + response);
    
    res.send(response);
});

router.post('/currentMatchday', async (req, res, next) => {
    //console.log("Got request '/currentMatchday'");

    let currentMatchday = await script.getCurrentMatchday();
    let response = JSON.stringify(currentMatchday);

    //console.log("CurrentMatchday: " + response);
    
    res.send(response);
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
        int < 2004 &&
        int > getThisSeasonYear());
}

module.exports = router;
