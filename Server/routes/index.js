const express = require('express');
const router = express.Router();
const requestHandler = require('../public/javascripts/requestHandler');
const Handler = require('../public/javascripts/Handler');

router.get('/seasons', async (req, res, next) => {
	let response = await requestHandler.handleSeveralRequests(await Handler.createSeasonsHandler(req.query));

	res.send(response);
});

router.get('/season', async (req, res, next) => {
	let response = await requestHandler.handleRequest(await Handler.createSeasonHandler(req.query));

	res.send(response);
});

router.get('/matchdays', async (req, res, next) => {
	let response = await requestHandler.handleSeveralRequests(await Handler.createMatchdaysHandler(req.query));

	res.send(response);
});

router.get('/matchday', async (req, res, next) => {
	let response = await requestHandler.handleRequest(await Handler.createMatchdayHandler(req.query));

	res.send(response);
});

router.get('/currentMatchdayNr', async (req, res, next) => {
	let response = await requestHandler.handleRequest(await Handler.createCurrentMatchdayNrHandler());

	res.send(response);
});

router.get('/currentMatchday', async (req, res, next) => {
	let response = await requestHandler.handleRequest(await Handler.createCurrentMatchdayHandler());

	res.send(response);
});

router.get('/tables', async (req, res, next) => {
	let response = await requestHandler.handleSeveralRequests(await Handler.createTablesHandler(req.query));

	res.send(response);
});

router.get('/table', async (req, res, next) => {
	let response = await requestHandler.handleRequest(await Handler.createTableHandler(req.query));

	res.send(response);
});

router.get('/homeTables', async (req, res, next) => {
	let response = await requestHandler.handleSeveralRequests(await Handler.createHomeTablesHandler(req.query));

	res.send(response);
});

router.get('/homeTable', async (req, res, next) => {
	let response = await requestHandler.handleRequest(await Handler.createHomeTableHandler(req.query));

	res.send(response);
});

router.get('/awayTables', async (req, res, next) => {
	let response = await requestHandler.handleSeveralRequests(await Handler.createAwayTablesHandler(req.query));

	res.send(response);
});

router.get('/awayTable', async (req, res, next) => {
	let response = await requestHandler.handleRequest(await Handler.createAwayTableHandler(req.query));

	res.send(response);
});

router.get('/formTables', async (req, res, next) => {
	let response = await requestHandler.handleSeveralRequests(await Handler.createFormTablesHandler(req.query));

	res.send(response);
});

router.get('/formTable', async (req, res, next) => {
	let response = await requestHandler.handleRequest(await Handler.createFormTableHandler(req.query));

	res.send(response);
});

router.post('/postExpectedMatchday', async (req, res, next) => {
	let response = await requestHandler.handlePostRequest(
		Handler.createPostExpectedMatchdayHandler(JSON.parse(req.body.data))
	);

	res.send(response);
});

module.exports = router;
