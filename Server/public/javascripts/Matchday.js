const Match = require('./Match');
const Handler = require('./Handler');
const FileUpdater = require('./FileUpdater');
const Season = require('./Season');

module.exports.createMatchday = async (seasonYear, matchdayNr, matchdayMatches, obj = {}) => {
	let md = new Matchday(seasonYear, matchdayNr, matchdayMatches, obj.isTableNeeded, obj.season, obj.expectedMatchday);
	if (obj.isTableNeeded != false) {
		await md.createTable(seasonYear, matchdayNr, obj.season);
	}
	return md;
};

class Matchday {
	constructor(seasonYear, matchdayNr, matchdayMatches, areTableNeeded, season, expectedMatchday) {
		//console.log('Creating new matchday: ' + matchdayNr);
		this.matchdayNr = matchdayNr;
		this.matches = matchdayMatches.map(m => {
			let expectedMatch = expectedMatchday
				? expectedMatchday.matches.find(em => m.Team1.TeamName == em.teams.home)
				: undefined;

			return expectedMatch
				? new Match(seasonYear, matchdayNr, m, expectedMatch)
				: new Match(seasonYear, matchdayNr, m);
		});
	}

	async createTable(seasonYear, matchdayNr, season) {
		if (!season) season = await Season.createSeasonWithoutTable(seasonYear);
		//console.log('Matchday.createTable: ' + season.matchdays.length);
		let promiseArr = [
			Handler.createTableHandler,
			Handler.createHomeTableHandler,
			Handler.createAwayTableHandler,
			Handler.createFormTableHandler
		].map(async createHandler => {
			const handler = await createHandler({seasonYear, matchdayNr}, season);
			return FileUpdater(handler);
		});
		[this.table, this.homeTable, this.awayTable, this.formTable] = await Promise.all(promiseArr);
	}
}
