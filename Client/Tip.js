class Tip {
	constructor(correspondingMatch) {
		this.match = correspondingMatch;
	}

	logResult() {
		console.log(
			this.match.teams.home.name +
				' ' +
				this.result.home +
				':' +
				this.result.away +
				' ' +
				this.match.teams.away.name
		);
	}

	calculateResult() {
		let matches = this.findAllMatchesOfTeams();

		const goalAvgInLeague = this.findGoalAvgInLeague(matches);

		let offensiveRatingHomeTeam =
			this.calcGoalsPerGameOfTeam(matches.homeTeamMatches.allMatches, this.match.teams.home) - goalAvgInLeague;
		let defensiveRatingAwayTeam =
			this.calcGoalsAgainstPerGameOfTeam(matches.awayTeamMatches.allMatches, this.match.teams.away) -
			goalAvgInLeague;

		let offensiveRatingAwayTeam =
			this.calcGoalsPerGameOfTeam(matches.awayTeamMatches.allMatches, this.match.teams.away) - goalAvgInLeague;
		let defensiveRatingHomeTeam =
			this.calcGoalsAgainstPerGameOfTeam(matches.homeTeamMatches.allMatches, this.match.teams.home) -
			goalAvgInLeague;

		let ratingHomeTeam = (defensiveRatingAwayTeam + offensiveRatingHomeTeam) / 2;
		let ratingAwayTeam = (defensiveRatingHomeTeam + offensiveRatingAwayTeam) / 2;

		let avgNrOfGoalsOfTeams = this.avgNrOfGoalsPerGameOfTeams(matches);

		let goalsHomeTeam = avgNrOfGoalsOfTeams / 2 + ratingHomeTeam;
		let goalsAwayTeam = avgNrOfGoalsOfTeams / 2 + ratingAwayTeam;

		let probabilitiesHomeTeamGoals = this.fnPoisson(goalsHomeTeam);
		let probabilitiesAwayTeamGoals = this.fnPoisson(goalsAwayTeam);

		let probabilityHomeTeamWins = this.calcPercentageHomeTeamWins(
			probabilitiesHomeTeamGoals,
			probabilitiesAwayTeamGoals
		);
		let probabilityDraw = this.calcPercentageDraw(probabilitiesHomeTeamGoals, probabilitiesAwayTeamGoals);
		let probabilityTeamWins = this.calcPercentageAwayTeamWins(
			probabilitiesHomeTeamGoals,
			probabilitiesAwayTeamGoals
		);

		this.result =
			probabilityHomeTeamWins > probabilityDraw
				? 'home'
				: probabilityDraw > probabilityTeamWins ? 'draw' : 'away';
	}

	avgNrOfGoalsPerGameOfTeams(matches) {
		let goals = 0;
		let count = 0;
		matches.homeTeamMatches.allMatches.forEach(m => {
			goals += m.expectedResult.home;
			goals += m.expectedResult.away;
			count += 2;
		});
		matches.awayTeamMatches.allMatches.forEach(m => {
			goals += m.expectedResult.home;
			goals += m.expectedResult.away;
			count += 2;
		});

		return goals / count;
	}

	calcPercentageHomeTeamWins(psHomeTeamGoals, psAwayTeamGoals) {
		let p = 0;
		psHomeTeamGoals.forEach((p1, i1) => {
			psAwayTeamGoals.forEach((p2, i2) => {
				const fn = () => i1 > i2;
				p += this.calcTotalProbability(fn, p1, p2);
			});
		});

		return p;
	}

	calcPercentageDraw(psHomeTeamGoals, psAwayTeamGoals) {
		let p = 0;
		psHomeTeamGoals.forEach((p1, i1) => {
			psAwayTeamGoals.forEach((p2, i2) => {
				const fn = () => i1 == i2;
				p += this.calcTotalProbability(fn, p1, p2);
			});
		});

		return p;
	}

	calcPercentageAwayTeamWins(psHomeTeamGoals, psAwayTeamGoals) {
		let p = 0;
		psHomeTeamGoals.forEach((p1, i1) => {
			psAwayTeamGoals.forEach((p2, i2) => {
				const fn = () => i2 > i1;
				p += this.calcTotalProbability(fn, p1, p2);
			});
		});

		return p;
	}

	calcTotalProbability(fn, p1, p2) {
		if (fn()) return p1 * p2;

		return 0;
	}

	fnPoisson(A) {
		return [0, 1, 2, 3, 4, 5].map(x => Math.pow(A, x) / Math.faculty(x) * Math.exp(-A));
	}

	findGoalAvgInLeague(matches) {
		let totalGoals = 0;
		let totalCount = 0;
		matches.homeTeamMatches.allMatches.forEach(m1 => {
			seasons[SEASON_YEAR - m1.season].matchdays[m1.matchdayNr].matches.forEach(m2 => {
				totalGoals += m2.result.home;
				totalGoals += m2.result.away;
				totalCount += 2;
			});
		});

		return totalGoals / totalCount;
	}

	calcGoalsPerGameOfTeam(matches, team) {
		let totalGoals = this.countGoalsOfTeam(matches, team);
		let goalsPerGame = totalGoals / matches.length;
		return goalsPerGame;
	}

	countGoalsOfTeam(matches, team) {
		let goals = 0;

		matches.forEach(m => {
			if (m.teams.home.name == team.name) goals += m.expectedResult.home;
			else goals += m.expectedResult.away;
		});

		return goals;
	}

	calcGoalsAgainstPerGameOfTeam(matches, team) {
		let totalGoalsAgainst = this.countGoalsAgainstOfTeam(matches, team);
		let goalsAgainstPerGame = totalGoalsAgainst / matches.length;
		return goalsAgainstPerGame;
	}

	countGoalsAgainstOfTeam(matches, team) {
		let goalsAgainst = 0;

		matches.forEach(m => {
			if (m.teams.home.name == team.name) goalsAgainst += m.expectedResult.away;
			else goalsAgainst += m.expectedResult.home;
		});

		return goalsAgainst;
	}

	findAllMatchesOfTeams() {
		let homeTeamMatches = {
			allMatches: [],
			formMatches: [],
			homeAwayMatches: [],
			matchesAgainstEachOther: [],
			matchesAgainstOpponentOnSameLevel: [],
			matchesAgainstSimilarOpponent: [],
			homeAwayFormMathces: []
		};

		let awayTeamMatches = {
			allMatches: [],
			formMatches: [],
			homeAwayMatches: [],
			matchesAgainstEachOther: [],
			matchesAgainstOpponentOnSameLevel: [],
			matchesAgainstSimilarOpponent: [],
			homeAwayFormMathces: []
		};

		seasons[SEASON_YEAR - this.match.season + 1].matchdays.forEach(md => {
			md.matches.forEach(m => {
				if (this.match.matchdayNr <= 4) {
					if (m.matchdayNr >= 34 - NR_OF_FORM_MATCHES + this.match.matchdayNr) {
						if (
							m.teams.home.name == this.match.teams.home.name ||
							m.teams.away.name == this.match.teams.home.name
						) {
							homeTeamMatches.formMatches.push(m);
						}

						if (
							m.teams.home.name == this.match.teams.away.name ||
							m.teams.away.name == this.match.teams.away.name
						) {
							awayTeamMatches.formMatches.push(m);
						}
					}
				}

				if (
					(m.teams.home.name == this.match.teams.away.name &&
						m.teams.away.name == this.match.teams.home.name &&
						this.areOpponentsSameLevelDifferentSeasons(
							m,
							this.match,
							m.teams.home,
							this.match.teams.away
						) &&
						this.areOpponentsSameLevelDifferentSeasons(
							m,
							this.match,
							m.teams.away,
							this.match.teams.home
						)) ||
					(m.teams.away.name == this.match.teams.away.name &&
						m.teams.home.name == this.match.teams.home.name &&
						this.areOpponentsSameLevelDifferentSeasons(
							m,
							this.match,
							m.teams.home,
							this.match.teams.home
						) &&
						this.areOpponentsSameLevelDifferentSeasons(m, this.match, m.teams.away, this.match.teams.away))
				) {
					homeTeamMatches.matchesAgainstEachOther.push(m);
					awayTeamMatches.matchesAgainstEachOther.push(m);
				}
			});
		});

		seasons[SEASON_YEAR - this.match.season].matchdays.forEach(md => {
			md.matches.forEach(m => {
				const matchdayDiff = this.calcMatchdayDiff(m, this.match);
				if (matchdayDiff < 0) {
					if (m.teams.home.name == this.match.teams.home.name) {
						homeTeamMatches.allMatches.push(m);
						homeTeamMatches.homeAwayMatches.push(m);

						if (matchdayDiff >= -NR_OF_FORM_MATCHES) {
							homeTeamMatches.homeAwayFormMathces.push(m);
							homeTeamMatches.formMatches.push(m);
						}

						if (this.areOpponentsSameLevelSameSeason(this.match, m.teams.away, this.match.teams.away)) {
							homeTeamMatches.matchesAgainstOpponentOnSameLevel.push(m);
						}

						if (
							this.areOpponentsSimilarSameSeason(
								this.match,
								m,
								this.match.teams.home,
								this.match.teams.away,
								m.teams.away
							)
						) {
							homeTeamMatches.matchesAgainstSimilarOpponent.push(m);
						}
					}

					if (m.teams.away.name == this.match.teams.home.name) {
						homeTeamMatches.allMatches.push(m);

						if (matchdayDiff >= -NR_OF_FORM_MATCHES) {
							homeTeamMatches.formMatches.push(m);
						}

						if (this.areOpponentsSameLevelSameSeason(this.match, m.teams.home, this.match.teams.away)) {
							homeTeamMatches.matchesAgainstOpponentOnSameLevel.push(m);
						}
						if (
							this.areOpponentsSimilarSameSeason(
								this.match,
								m,
								this.match.teams.home,
								this.match.teams.away,
								m.teams.home
							)
						) {
							homeTeamMatches.matchesAgainstSimilarOpponent.push(m);
						}
					}

					if (m.teams.home.name == this.match.teams.away.name) {
						awayTeamMatches.allMatches.push(m);

						if (matchdayDiff >= -NR_OF_FORM_MATCHES) {
							awayTeamMatches.formMatches.push(m);
							awayTeamMatches.formMatches.push(m);
						}

						if (this.areOpponentsSameLevelSameSeason(this.match, m.teams.away, this.match.teams.home)) {
							awayTeamMatches.matchesAgainstOpponentOnSameLevel.push(m);
						}

						if (
							this.areOpponentsSimilarSameSeason(
								this.match,
								m,
								this.match.teams.away,
								this.match.teams.home,
								m.teams.away
							)
						) {
							awayTeamMatches.matchesAgainstSimilarOpponent.push(m);
						}
					}

					if (m.teams.away.name == this.match.teams.away.name) {
						awayTeamMatches.allMatches.push(m);
						awayTeamMatches.homeAwayMatches.push(m);

						if (matchdayDiff >= -NR_OF_FORM_MATCHES) {
							awayTeamMatches.formMatches.push(m);
						}

						if (this.areOpponentsSameLevelSameSeason(this.match, m.teams.home, this.match.teams.home)) {
							awayTeamMatches.matchesAgainstOpponentOnSameLevel.push(m);
						}

						if (
							this.areOpponentsSimilarSameSeason(
								this.match,
								m,
								this.match.teams.away,
								this.match.teams.home,
								m.teams.home
							)
						) {
							awayTeamMatches.matchesAgainstSimilarOpponent.push(m);
						}
					}

					if (
						m.teams.home.name == this.match.teams.away.name &&
						m.teams.away.name == this.match.teams.home.name
					) {
						homeTeamMatches.matchesAgainstEachOther.push(m);
						awayTeamMatches.matchesAgainstEachOther.push(m);
					}
				}
			});
		});

		return {homeTeamMatches, awayTeamMatches};
	}

	areOpponentsSimilarSameSeason(currentMatch, previousMatch, team, teamsCurrentOpponent, teamsPreviousOpponent) {
		return (
			this.didWinOrDrawAgainstBetterOpponent(
				currentMatch,
				previousMatch,
				team,
				teamsCurrentOpponent,
				teamsPreviousOpponent
			) ||
			this.didDrawOrLooseAgainstWorseOpponent(
				currentMatch,
				previousMatch,
				team,
				teamsCurrentOpponent,
				teamsPreviousOpponent
			)
		);
	}

	didWinOrDrawAgainstBetterOpponent(currentMatch, previousMatch, team, teamsCurrentOpponent, teamsPreviousOpponent) {
		let teamHomeAway, opponentHomeAway;
		if (previousMatch.teams.home.name == team.name) {
			teamHomeAway = 'home';
			opponentHomeAway = 'away';
		} else {
			teamHomeAway = 'away';
			opponentHomeAway = 'home';
		}
		let didWinOrDraw = previousMatch.result[teamHomeAway] >= previousMatch.result[opponentHomeAway];

		let lastMd = this.findMatchdayBeforeMatch(currentMatch);

		let previousOpponentPointsPerMatchday = this.findPointsPerMatchday(lastMd.table, teamsPreviousOpponent);
		let currentOpponentPointsPerMatchday = this.findPointsPerMatchday(lastMd.table, teamsCurrentOpponent);

		let wasPreviousOpponentBetterOrSameLevel =
			previousOpponentPointsPerMatchday + CLOSE_OPPONENT_DIST >= currentOpponentPointsPerMatchday;

		if (didWinOrDraw && wasPreviousOpponentBetterOrSameLevel) {
			/* console.log(
				'winOrDrawAgainstBetter ' +
					team.name +
					'Previous match: ' +
					team.name +
					' vs. ' +
					teamsPreviousOpponent.name +
					' ' +
					previousMatch.result.home +
					':' +
					previousMatch.result.away +
					`
					${teamsPreviousOpponent.name}(${previousOpponentPointsPerMatchday})
					${teamsCurrentOpponent.name}(${currentOpponentPointsPerMatchday})
					`
			); */
		}

		return didWinOrDraw && wasPreviousOpponentBetterOrSameLevel;
	}

	didDrawOrLooseAgainstWorseOpponent(currentMatch, previousMatch, team, teamsCurrentOpponent, teamsPreviousOpponent) {
		let teamHomeAway, opponentHomeAway;
		if (previousMatch.teams.home.name == team.name) {
			teamHomeAway = 'home';
			opponentHomeAway = 'away';
		} else {
			teamHomeAway = 'away';
			opponentHomeAway = 'home';
		}
		let didLooseOrDraw = previousMatch.result[teamHomeAway] <= previousMatch.result[opponentHomeAway];

		let lastMd = this.findMatchdayBeforeMatch(currentMatch);

		let previousOpponentPointsPerMatchday = this.findPointsPerMatchday(lastMd.table, teamsPreviousOpponent);
		let currentOpponentPointsPerMatchday = this.findPointsPerMatchday(lastMd.table, teamsCurrentOpponent);

		let wasPreviousOpponentWorseOrSameLevel =
			previousOpponentPointsPerMatchday - CLOSE_OPPONENT_DIST <= currentOpponentPointsPerMatchday;

		if (didLooseOrDraw && wasPreviousOpponentWorseOrSameLevel) {
			/* console.log(
				'looseOrDrawAgainstWorse ' +
					team.name +
					' Previous match: ' +
					previousMatch.teams.home.name +
					' vs. ' +
					previousMatch.teams.away.name +
					' ' +
					previousMatch.result.home +
					':' +
					previousMatch.result.away +
					`
					${teamsPreviousOpponent.name}(${previousOpponentPointsPerMatchday})
					${teamsCurrentOpponent.name}(${currentOpponentPointsPerMatchday})
					`
			); */
		}
		return didLooseOrDraw && wasPreviousOpponentWorseOrSameLevel;
	}

	areOpponentsSameLevelSameSeason(currentMatch, t1, t2) {
		let lastMd = this.findMatchdayBeforeMatch(currentMatch);

		return this.areTeamsCloseInTables(lastMd.table, lastMd.table, t1, t2);
	}

	areOpponentsSameLevelDifferentSeasons(m1, m2, t1, t2) {
		let md1 = seasons[SEASON_YEAR - m1.season].matchdays[33];
		let md2 = this.findMatchdayBeforeMatch(m2);

		return this.areTeamsCloseInTables(md1.table, md2.table, t1, t2);
	}

	areTeamsCloseInTables(table1, table2, t1, t2) {
		let pointsPerMatchdayO1 = this.findPointsPerMatchday(table1, t1);
		let pointsPerMatchdayO2 = this.findPointsPerMatchday(table2, t2);

		let diff = pointsPerMatchdayO1 - pointsPerMatchdayO2;

		return diff <= CLOSE_OPPONENT_DIST && diff >= -CLOSE_OPPONENT_DIST;
	}

	findMatchdayBeforeMatch(m) {
		if (m.matchdayNr == 1) return seasons[SEASON_YEAR - m.season + 1].matchdays[33];
		else return seasons[SEASON_YEAR - m.season].matchdays[m.matchdayNr - 2];
	}

	findPointsPerMatchday(table, t) {
		let tableTeam = table.find(tableTeam => tableTeam.name == t.name);
		return tableTeam.points / tableTeam.nrOfMatches;
	}

	calcMatchdayDiff(m1, m2) {
		if (m1.season < m2.season) return m1.matchdayNr - m2.matchdayNr - 34;
		if (m1.season > m2.season) return m1.matchdayNr - m2.matchdayNr + 34;
		return m1.matchdayNr - m2.matchdayNr;
	}

	wasMatchBeforeMatch(m1, m2) {
		if (m1.season < m2.season) return true;
		if (m1.season == m2.season && m1.matchdayNr < m2.matchdayNr) return true;
		return false;
	}

	addWeights(matches) {
		matches.map(m => {
			m.weight = this.calcWeight(m);
			return m;
		});
	}

	calcWeight(m) {
		let weight = 1;

		let timeWeight = this.calcTimeWeight(m);
		weight *= !timeWeight ? 1 : timeWeight;

		let homeAwayWeight = this.calcHomeAwayWeight(m);
		weight *= !homeAwayWeight ? 1 : homeAwayWeight;

		let opponentStrengthWeight = this.calcOpponentStrengthWeight(m);
		weight *= !opponentStrengthWeight ? 1 : opponentStrengthWeight;

		let returnMatchWeight = this.calcReturnMatchWeight(m);
		weight *= !returnMatchWeight ? 1 : returnMatchWeight;

		if (!weight && weight != 0) {
			console.log('ERROR');
		}

		return weight;
	}

	calcTimeWeight(m) {
		let mdDiff = this.calcMatchdayDiff(this.match, m);
		let result = this.timeWeightA / Math.pow(mdDiff, this.timeWeightB);
		return result;
	}

	calcHomeAwayWeight(m) {
		return this.match.teams.home.name == m.teams.home.name || this.match.teams.away.name == m.teams.away.name
			? this.homeAwayWeightA
			: 1;
	}

	calcOpponentStrengthWeight(m) {
		let pointsPerGameDiff = this.calcPointsPerGameDiffDiff(this.match, m);
		let result = this.opponentStrengthWeightA / Math.pow(pointsPerGameDiff, this.opponentStrengthWeightB);
		return result == Infinity ? 2 * this.opponentStrengthWeightA : result;
	}

	calcPointsPerGameDiffDiff(m1, m2) {
		let t = this.findThisTeam(m1, m2);

		let m1Diff = this.calcPointsPerGameDiff(m1, t);

		let m2Diff = this.calcPointsPerGameDiff(m2, t);

		return Math.abs(m1Diff - m2Diff);
	}

	calcPointsPerGameDiff(m, t) {
		let o = this.findOpponent(m, t);

		let teamPointsPerGame = this.calcPointsPerGame(m, t);
		let opponentPointsPerGame = this.calcPointsPerGame(m, o);

		return teamPointsPerGame - opponentPointsPerGame;
	}

	findThisTeam(m1, m2) {
		return m1.teams.home.name == m2.teams.home.name || m1.teams.home.name == m2.teams.away.name
			? m1.teams.home
			: m1.teams.away;
	}

	findOpponent(m, t) {
		return m.teams.home.name != t.name ? m.teams.home : m.teams.away;
	}

	calcPointsPerGame(m, t) {
		let tableTeam = this.findTeamInTable(t, m.season, m.matchdayNr);
		if (!tableTeam) return 0;
		return this.calcPointsPerGameOfTableTeam(tableTeam);
	}

	calcPointsPerGameOfTableTeam(tableTeam) {
		return tableTeam.points / tableTeam.nrOfMatches;
	}

	findTeamInTable(t, season, matchdayNr, tableType) {
		tableType = tableType || 'table';
		let seasonIdx = seasons.findIndex(s => s.year == season);
		if (seasonIdx == undefined || seasonIdx == -1) {
			console.log('no season found');
		}
		let matchdayIdx = matchdayNr - 2;
		if (matchdayIdx < 0) {
			matchdayIdx = 33;
			seasonIdx++;
		}
		if (!seasons[seasonIdx]) {
			console.log('no season found');
		}
		let table = seasons[seasonIdx].matchdays[matchdayIdx][tableType];
		let tableTeam = table.find(tableTeam => tableTeam.name == t.name);

		return tableTeam;
	}

	calcReturnMatchWeight(m) {
		return (this.match.teams.home.name == m.teams.home.name && this.match.teams.away.name == m.teams.away.name) ||
		(this.match.teams.home.name == m.teams.away.name && this.match.teams.away.name == m.teams.home.name)
			? this.returnMatchWeightA
			: 1;
	}

	sortAllAwayTeamMatches(matches, sorted) {
		matches.forEach(m => {
			if (m.teams.home.name == this.match.teams.away.name) {
				if (m.expectedResult.home > m.expectedResult.away) sorted = this.sortAwayTeamWin(m, sorted);
				else if (m.expectedResult.home < m.expectedResult.away) sorted = this.sortHomeTeamWin(m, sorted);
				else sorted = this.sortDraw(m, sorted);
			} else if (m.teams.away.name == this.match.teams.away.name) {
				if (m.expectedResult.away > m.expectedResult.home) sorted = this.sortAwayTeamWin(m, sorted);
				else if (m.expectedResult.away < m.expectedResult.home) sorted = this.sortHomeTeamWin(m, sorted);
				else sorted = this.sortDraw(m, sorted);
			}
		});

		return sorted;
	}

	sortAllHomeTeamMatches(matches, sorted) {
		matches.forEach(m => {
			if (m.teams.home.name == this.match.teams.home.name) {
				if (m.expectedResult.home > m.expectedResult.away) sorted = this.sortHomeTeamWin(m, sorted);
				else if (m.expectedResult.home < m.expectedResult.away) sorted = this.sortAwayTeamWin(m, sorted);
				else sorted = this.sortDraw(m, sorted);
			} else if (m.teams.away.name == this.match.teams.home.name) {
				if (m.expectedResult.away > m.expectedResult.home) sorted = this.sortHomeTeamWin(m, sorted);
				else if (m.expectedResult.away < m.expectedResult.home) sorted = this.sortAwayTeamWin(m, sorted);
				else sorted = this.sortDraw(m, sorted);
			}
		});
		return sorted;
	}

	sortHomeTeamWin(m, obj) {
		return this.sortAnyResult(m, obj, 'homeTeamWin');
	}

	sortAwayTeamWin(m, obj) {
		return this.sortAnyResult(m, obj, 'awayTeamWin');
	}

	sortDraw(m, obj) {
		return this.sortAnyResult(m, obj, 'draw');
	}

	sortAnyResult(m, obj, childObjName) {
		obj.weight += m.weight;
		let childObj = this.getOrSetChildObj(obj, childObjName);
		childObj = this.sortByGoalDiff(m, childObj);
		return obj;
	}

	sortByGoalDiff(m, obj) {
		obj.weight += m.weight;
		let goalDiff = Math.abs(Math.round(m.expectedResult.home - m.expectedResult.away));
		let goalDiffStr = goalDiff + 'GoalDiff';
		let childObj = this.getOrSetChildObj(obj, goalDiffStr);
		childObj = this.sortByResult(m, childObj);
		return obj;
	}

	sortByResult(m, obj) {
		obj.weight += m.weight;
		let childArr = this.getOrSetChildResultArr(obj, m.result);
		childArr.push(m);
		childArr.weight += m.weight;
		return obj;
	}

	getResultString(result) {
		return `${Math.max(result.home, result.away)}:${Math.min(result.home, result.away)}`;
	}

	getOrSetChildObj(obj, name) {
		if (!obj[name]) obj[name] = {weight: 0};
		return obj[name];
	}

	getOrSetChildResultArr(obj, result) {
		let name = this.getResultString(result);
		if (!obj[name]) {
			obj[name] = [];
			obj[name].weight = 0;
		}
		return obj[name];
	}
}

class TipWithTensors extends Tip {
	constructor(correspondingMatch) {
		super(correspondingMatch);
	}

	calcWeight(m) {
		let weight;
		tf.tidy(() => {
			let _weight = tf.scalar(1);

			let _mdDiff = tf.scalar(this.calcMatchdayDiff(this.match, m));
			let _result = tf.div(this.timeWeightA, tf.pow(_mdDiff, this.timeWeightB));
			let _timeWeight = _result.dataSync()[0] < 0 || _result.dataSync()[0] == Infinity ? tf.scalar(0) : _result;
			_weight = _weight.mul(_timeWeight);

			tf.dispose(_mdDiff);
			tf.dispose(_timeWeight);
			tf.dispose(_result);

			let _homeAwayWeight =
				this.match.teams.home.name == m.teams.home.name || this.match.teams.away.name == m.teams.away.name
					? this.homeAwayWeightA
					: tf.scalar(1);
			_weight = _weight.mul(_homeAwayWeight);

			tf.dispose(_homeAwayWeight);

			let _pointsPerGameDiff = tf.scalar(this.calcPointsPerGameDiffDiff(this.match, m));
			let _result2 = tf.div(
				this.opponentStrengthWeightA,
				tf.pow(_pointsPerGameDiff, this.opponentStrengthWeightB)
			);
			let _opponentStrengthWeight = _result2.dataSync()[0] == Infinity ? tf.scalar(2) : _result2;
			_weight = _weight.mul(_opponentStrengthWeight);

			tf.dispose(_pointsPerGameDiff);
			tf.dispose(_opponentStrengthWeight);
			tf.dispose(_result2);

			let _returnMatchWeight =
				(this.match.teams.home.name == m.teams.home.name && this.match.teams.away.name == m.teams.away.name) ||
				(this.match.teams.home.name == m.teams.away.name && this.match.teams.away.name == m.teams.home.name)
					? this.returnMatchWeightA
					: tf.scalar(1);
			_weight = _weight.mul(_returnMatchWeight);

			tf.dispose(_returnMatchWeight);

			weight = _weight.dataSync()[0];
			tf.dispose(_weight);
		});
		return weight;
	}

	calcTimeWeight(m) {
		return tf.tidy(() => {
			let _mdDiff = tf.scalar(this.calcMatchdayDiff(this.match, m));
			let _result = tf.div(this.timeWeightA, tf.pow(_mdDiff, this.timeWeightB));
			return _result.dataSync()[0] < 0 || _result.dataSync()[0] == Infinity ? tf.scalar(0) : _result;
		});
	}

	calcHomeAwayWeight(m) {
		return tf.tidy(
			() =>
				this.match.teams.home.name == m.teams.home.name || this.match.teams.away.name == m.teams.away.name
					? this.homeAwayWeightA
					: tf.scalar(1)
		);
	}

	calcOpponentStrengthWeight(m) {
		return tf.tidy(() => {
			let _pointsPerGameDiff = tf.scalar(this.calcPointsPerGameDiffDiff(this.match, m));
			let _result = tf.div(
				this.opponentStrengthWeightA,
				tf.pow(_pointsPerGameDiff, this.opponentStrengthWeightB)
			);
			return _result.dataSync()[0] == Infinity ? tf.scalar(2) : _result;
		});
	}

	calcReturnMatchWeight(m) {
		return tf.tidy(
			() =>
				(this.match.teams.home.name == m.teams.home.name && this.match.teams.away.name == m.teams.away.name) ||
				(this.match.teams.home.name == m.teams.away.name && this.match.teams.away.name == m.teams.home.name)
					? this.returnMatchWeightA
					: tf.scalar(1)
		);
	}
}
