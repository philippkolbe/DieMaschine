const express = require('express');
const router = express.Router();
const script = require('../public/javascripts/script.js');

router.get('/season', async (req, res, next) => {
    let response = await script.handleSeveralRequests(new script.SeasonHandler(req.query.start, req.query.end));
    
    //console.log("Seasons: " + response);

    res.send(response);
});

router.get('/matchday', async (req, res, next) => {
    let response = await script.handleSeveralRequests(new script.MatchdayHandler(req.query.season, req.query.start, req.query.end));

    //console.log("Matchday: " + response);
    
    res.send(response);
});

router.get('/current', async (req, res, next) => {
    let response = await script.handleRequest(new script.CurrentMatchdayNrHandler());

   // console.log("CurrentMatchdayNr: " + response);
    
    res.send(response);
});

router.get('/currentMatchday', async (req, res, next) => {
    let response = await script.handleRequest(new script.CurrentMatchdayHandler());

    //console.log("CurrentMatchday: " + response);
    
    res.send(response);
});

module.exports = router;
