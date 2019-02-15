const express = require('express');
const router = express.Router();
const requestHandler = require('../public/javascripts/requestHandler');
const Handler = require('../public/javascripts/Handler');

router.get('/season', async (req, res, next) => {
    console.log("Start")
    console.time();
    let response = await requestHandler.handleSeveralRequests(new Handler.SeasonHandler(req.query.start, req.query.end));
    
    //console.log("Seasons: " + response);

    res.send(response);
    console.timeEnd();
});

router.get('/matchday', async (req, res, next) => {
    let response = await requestHandler.handleSeveralRequests(new Handler.MatchdayHandler(req.query.season, req.query.start, req.query.end));

    //console.log("Matchday: " + response);
    
    res.send(response);
});

router.get('/current', async (req, res, next) => {
    let response = await requestHandler.handleRequest(new Handler.CurrentMatchdayNrHandler());

   // console.log("CurrentMatchdayNr: " + response);
    
    res.send(response);
});

router.get('/standings', async (req, res, next) => {
    let response = await requestHandler.handleRequest(new Handler.StandingsHandler(req.query.season, req.query.matchday));

    //console.log("CurrentMatchday: " + response);
    
    res.send(response);
});

router.get('/homeStandings', async (req, res, next) => {
    let response = await requestHandler.handleRequest(new Handler.HomeStandingsHandler(req.query.season, req.query.matchday));

    //console.log("CurrentMatchday: " + response);
    
    res.send(response);
});

router.get('/awayStandings', async (req, res, next) => {
    let response = await requestHandler.handleRequest(new Handler.AwayStandingsHandler(req.query.season, req.query.matchday));

    //console.log("CurrentMatchday: " + response);
    
    res.send(response);
});

router.get('/formStandings', async (req, res, next) => {
    let response = await requestHandler.handleRequest(new Handler.FormStandingsHandler(req.query.season, req.query.matchday));

    //console.log("CurrentMatchday: " + response);
    
    res.send(response);
});

module.exports = router;
