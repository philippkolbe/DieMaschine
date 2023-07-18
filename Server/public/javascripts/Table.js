const TableTeam = require('./TableTeam');

module.exports = class {
	constructor(season, config) {
		//console.log('Creating Table: mds length: ' + season.matchdays.length);
		this.table = [];
		this.setup(season);
		//console.log('config: ' + JSON.stringify(config));
		this.calculate(season, config);
		this.table.sort(this.sort);
	}

	setup(season) {
		season.matchdays[0].matches.forEach(m => {
			this.table.push(new TableTeam(m.teams.home));
			this.table.push(new TableTeam(m.teams.away));
		});
	}

	calculate(season, config) {
		let mdNr = 0,
			mNr = 0;
		season.matchdays.forEach(md => {
			md.matches.forEach(m => {
				this.calcMatch(m, config);
				mNr++;
			});
			mdNr++;
		});
		//console.log("matchdaysNr : " + mdNr);
		//console.log("matchNr: " + mNr);
	}

	calcMatch(match, config) {
		['home', 'away'].forEach(homeOrAway => {
			//console.log(match.teams.home.name + ' vs ' + match.teams.away.name);
			if (
				(!config.home && !config.away) ||
				(config.home && homeOrAway == 'home') ||
				(config.away && homeOrAway == 'away')
			) {
				let stats = this.calcStats(match, homeOrAway);
				let teamIdx = this.table.findIndex(t => t.name == match.teams[homeOrAway].name);
				/* console.log(
					'teamIdx: ',
					match.teams[homeOrAway].name,
					this.table.length,
					this.table.map(team => team.name)
				); */
				this.addStats(teamIdx, stats);
			}
		});
	}

	calcStats(match, homeOrAway) {
		let stats = {};
		//console.log('Match: ' + JSON.stringify(match));
		const opponentHomeOrAway = homeOrAway == 'home' ? 'away' : 'home';
		//console.log('Result: ' + JSON.stringify(match.result));
		stats.goals = match.result[homeOrAway];
		stats.goalsAgainst = match.result[opponentHomeOrAway];

		if (stats.goals > stats.goalsAgainst) stats.points = 3;
		else if (stats.goals < stats.goalsAgainst) stats.points = 0;
		else stats.points = 1;

		return stats;
	}

	addStats(idx, stats) {
		//console.log('idx: ' + idx, 'team: ' + JSON.stringify(this.table[idx]));
		//console.log('Adding stats: ' + JSON.stringify(stats));
		let tableTeam = this.table[idx];
		if (tableTeam) {
			tableTeam.addPoints(stats.points);
			tableTeam.addGoals(stats.goals);
			tableTeam.addGoalsAgainst(stats.goalsAgainst);
			tableTeam.addMatch();
		} else {
			console.error('No tableteam');
		}
	}

	sort(a, b) {
		if (a.points < b.points) return 1;
		else if (a.points > b.points) return -1;
		else {
			if (a.goalDifference < b.goalDifference) return 1;
			else if (a.goalDifference > b.goalDifference) return -1;
			else {
				if (a.games > b.games) return 1;
				else if (a.games < b.games) return -1;
				else return 0;
			}
		}
	}
};
