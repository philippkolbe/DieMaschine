const Matchday = require('./Matchday');
const Handler = require('./Handler');
const FileUpdater = require('./FileUpdater');
const fs = require('./FileSystem');

module.exports.createSeason = async (year, matches, isTableNeeded) => {
	//console.log("createSeason()");

	console.log('Season Creating Matchdays: ' + (isTableNeeded != false ? 'tableNeeded' : 'tableNOTNeeded'));
	let season = new Season(year, matches, isTableNeeded);
	await season.createMatchdays(year, matches, isTableNeeded);
	season.getTable();
	return season;
};

class Season {
	constructor(year, matches, isTableNeeded) {
		//console.log("Creating new season: " + year);
		this.year = year;
		this.matchdays = [];
		this.table = [];
		this.homeTable = [];
		this.awayTable = [];
		this.formTable = [];
	}

	async createMatchdays(year, matches, isTableNeeded) {
		let seasonWithoutTable;
		if (isTableNeeded != false) {
			//Calcing season without table for table
			seasonWithoutTable = await module.exports.createSeasonWithoutTable(year);
			//console.log('Season.createMatchdays: ' + seasonWithoutTable.matchdays.length);
		}

		let promiseArr = [];

		for (let matchdayNr = 0; matchdayNr < 34; matchdayNr++) {
			let matchdayMatches = this.getMatchdayMatches(matches, matchdayNr);
			let expectedMatchday = await this.getExpectedMatchday(matchdayNr + 1);
			console.log('Season.createMatchdays', isTableNeeded);
			if (matchdayMatches.length > 0)
				promiseArr.push(
					Matchday.createMatchday(year, matchdayNr + 1, matchdayMatches, {
						isTableNeeded,
						season: seasonWithoutTable,
						expectedMatchday
					})
				);
		}

		this.matchdays = await Promise.all(promiseArr);
		//console.log('Matchdays: ' + JSON.stringify(this.matchdays));
	}

	getTable() {
		if (this.matchdays.length) {
			const lastMd = this.matchdays[this.matchdays.length - 1];

			this.table = lastMd.table;
			this.homeTable = lastMd.homeTable;
			this.awayTable = lastMd.awayTable;
			this.formTable = lastMd.formTable;
		}
	}

	getMatchdayMatches(matches, matchDayNr) {
		let matchdayMatches = [];
		for (let matchNr = 0; matchNr < 9; matchNr++) {
			let m = matches[matchDayNr * 9 + matchNr];
			if (m.MatchIsFinished) matchdayMatches.push(m);
		}
		return matchdayMatches;
	}

	async getExpectedMatchday(matchDayNr) {
		try {
			let expectedMatchday = await fs.getSavedFile(
				`Season ${this.year} Matchday ${matchDayNr} Expected Matchday`
			);
			console.log('Season getExpectedMatchday: ', expectedMatchday);
			return expectedMatchday;
		} catch (e) {
			console.log('No expected matchday found: Season ' + this.year + ' Matchday ' + matchDayNr);
			return;
		}
	}
}

module.exports.createSeasonWithoutTable = async year => {
	const seasonHandler = await Handler.createSeasonHandler({season: year}, false);
	const season = await FileUpdater(seasonHandler);
	return season;
};
