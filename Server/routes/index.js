const express = require('express');
const router = express.Router();
const script = require('../public/javascripts/script.js');

router.post('/season', async (req, res, next) => {
    let response = await script.handleSeveralRequests(new script.SeasonHandler(req.body.start, req.body.end));
    
    //console.log("Seasons: " + response);

    res.send(response);
});

router.post('/matchday', async (req, res, next) => {
    console.log(req.body.start);
    let response = await script.handleSeveralRequests(new script.MatchdayHandler(req.body.season, req.body.start, req.body.end));

    console.log("Matchday: " + response);
    
    res.send(response);
});

router.post('/current', async (req, res, next) => {
    let response = await script.handleRequest(new script.CurrentMatchdayNrHandler());

   // console.log("CurrentMatchdayNr: " + response);
    
    res.send(response);
});

router.post('/currentMatchday', async (req, res, next) => {
    let response = await script.handleRequest(new script.CurrentMatchdayHandler());

    //console.log("CurrentMatchday: " + response);
    
    res.send(response);
});

module.exports = router;
