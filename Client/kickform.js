let factors = [
	//1.8825
	{
		//first 5 matchdays
		factorExpectedGoalDiffCurrentForm: 0.46636433730083815,
		factorExpectedGoalDiffOfCurrentSeason: 0.7446860865951528,
		factorExpectedGoalDiffOfLastSeasons: 0.7406928823023322,
		factorExpectedGoalsPerMatchOfLastSeasons: 0.5858632981111114,
		factorExpectedGoalsPerMatchOfThisSeason: 0.7176824898637677,
		factorHomeAdvantageOfCurrentSeason: 0.7359058643381531,
		factorHomeAdvantageLastSeasons: 0.7493380784023032,
		factorMarketValue: 0.4652357349729672
	},
	{
		//rest of first half of season
		factorExpectedGoalDiffCurrentForm: 0.46636433730083815,
		factorExpectedGoalDiffOfCurrentSeason: 0.7867309180913449,
		factorExpectedGoalDiffOfLastSeasons: 0.1526989576728066,
		factorExpectedGoalsPerMatchOfLastSeasons: 0.8191319749663775,
		factorExpectedGoalsPerMatchOfThisSeason: 0.7176824898637677,
		factorHomeAdvantageOfCurrentSeason: 0.7359058643381531,
		factorHomeAdvantageLastSeasons: 0.9108795596072901,
		factorMarketValue: 0.4652357349729672
	},
	{
		//second half of season
		factorExpectedGoalDiffCurrentForm: 0.9879058354891699,
		factorExpectedGoalDiffOfCurrentSeason: 0.5385090737808671,
		factorExpectedGoalDiffOfLastSeasons: 0.47698626171100345,
		factorExpectedGoalsPerMatchOfLastSeasons: 0.9089556751331289,
		factorExpectedGoalsPerMatchOfThisSeason: 0.31105220511778375,
		factorHomeAdvantageOfCurrentSeason: 0.774544402153621,
		factorHomeAdvantageLastSeasons: 0.23875235449214793,
		factorMarketValue: 0.16122939711283757
	}
];

let factorExpectedGoalDiffCurrentForm = 0.46636433730083815,
	factorExpectedGoalDiffOfCurrentSeason = 0.7446860865951528,
	factorExpectedGoalDiffOfLastSeasons = 0.7406928823023322,
	factorExpectedGoalsPerMatchOfLastSeasons = 0.5858632981111114,
	factorExpectedGoalsPerMatchOfThisSeason = 0.7176824898637677,
	factorHomeAdvantageOfCurrentSeason = 0.7359058643381531,
	factorHomeAdvantageLastSeasons = 0.7493380784023032,
	factorMarketValue = 0.4652357349729672;

let match;
let seasonYear;

function calcTipForMatch() {
	let totalGoalsOfMatch = calcExpectedGoalSum();
	let goalDifference = calcExpectedGoalDiff();

	let homeAdvantage = calcHomeAdvantage();

	let homeTeamGoals = totalGoalsOfMatch / 2 + goalDifference / 2 + homeAdvantage;
	let awayTeamGoals = totalGoalsOfMatch / 2 - goalDifference / 2;

	if (homeTeamGoals < 0) {
		awayTeamGoals -= homeTeamGoals;
		homeTeamGoals = 0;
	} else if (awayTeamGoals < 0) {
		homeTeamGoals -= awayTeamGoals;
		awayTeamGoals = 0;
	}

	let probabilities = calcProbabilities(homeTeamGoals, awayTeamGoals);

	return probabilities;
}

function calcProbabilities(homeTeamGoals, awayTeamGoals) {
	let ps = {};

	ps.homeTeamProbabilities = fnPoisson(homeTeamGoals);
	ps.awayTeamProbabilities = fnPoisson(awayTeamGoals);

	return ps;
}

function fnPoisson(A) {
	return [0, 1, 2, 3, 4, 5].map(x => Math.pow(A, x) / Math.faculty(x) * Math.exp(-A));
}

function calcHomeAdvantage() {
	let homeAdvantageOfLast3Seasons = calcHomeAdvantageOverLast3Seasons();
	let homeAdvantageOfCurrentSeason = calcHomeAdvantageOfSeason(seasons[seasonYear]);

	return (
		factorHomeAdvantageLastSeasons * homeAdvantageOfLast3Seasons +
		factorHomeAdvantageOfCurrentSeason * homeAdvantageOfCurrentSeason
	);
}

function calcHomeAdvantageOverLast3Seasons() {
	let factors = [0.5, 0.35, 0.15];
	let homeAdvantage = factors
		.map((f, i) => {
			return f * calcHomeAdvantageOfSeason(seasons[seasonYear + i + 1]);
		})
		.reduce((a, b) => a + b);
	return homeAdvantage;
}

function calcHomeAdvantageOfSeason(s) {
	let homeAwayGoalsDiff = 0;
	let nrOfMatches = 0;

	s.matchdays.forEach(md => {
		md.matches.forEach(m => {
			if (isMatchBeforeMatch(m, match)) {
				homeAwayGoalsDiff += m.result.home - m.result.away;
				nrOfMatches++;
			}
		});
	});

	if (nrOfMatches == 0) return 0;

	return homeAwayGoalsDiff / nrOfMatches;
}

function calcExpectedGoalSum() {
	let nrOfGoalsPerMatch = calcNrOfGoalsPerMatch();
	let effectiveExpectedGoalsPerMatchOfLastSeasons = calcExpectedGoalsPerMatchOfLastSeasons();
	let effectiveExpectedGoalsPerMatchOfThisSeason = calcEffectiveExpectedGoalsOfSeason(seasons[seasonYear]);

	return (
		nrOfGoalsPerMatch +
		factorExpectedGoalsPerMatchOfLastSeasons * effectiveExpectedGoalsPerMatchOfLastSeasons +
		factorExpectedGoalsPerMatchOfThisSeason * effectiveExpectedGoalsPerMatchOfThisSeason
	);
}

function calcNrOfGoalsPerMatch() {
	let nrOfGoals = 0;
	let nrOfMatches = 0;

	seasons.forEach(s => {
		s.matchdays.forEach(md => {
			md.matches.forEach(m => {
				if (isMatchBeforeMatch(m, match)) {
					nrOfGoals += m.result.home + m.result.away;
					nrOfMatches++;
				}
			});
		});
	});

	if (nrOfMatches != 0) return nrOfGoals / nrOfMatches;
	else return 3;
}

function calcExpectedGoalsPerMatchOfLastSeasons() {
	let effectiveExpectedGoalsPerMatch = [0.5, 0.35, 0.15]
		.map((f, i) => {
			return f * calcEffectiveExpectedGoalsOfSeason(seasons[seasonYear + i + 1]);
		})
		.reduce((a, b) => a + b);

	return effectiveExpectedGoalsPerMatch;
}

function calcEffectiveExpectedGoalsOfSeason(season) {
	let allExpectedGoals = 0;
	let nrOfAllMatches = 0;
	let teamsExpectedGoals = 0;
	let nrOfTeamsMatches = 0;

	season.matchdays.forEach(md => {
		md.matches.forEach(m => {
			if (isMatchBeforeMatch(m, match)) {
				if (!m.expectedResult) {
					console.log('No expected', m);
				}
				allExpectedGoals += m.expectedResult.home + m.expectedResult.away;
				nrOfAllMatches++;

				if (
					m.teams.home.name == match.teams.home.name ||
					m.teams.away.name == match.teams.away.name ||
					m.teams.home.name == match.teams.away.name ||
					m.teams.away.name == match.teams.home.name
				) {
					teamsExpectedGoals += m.expectedResult.home + m.expectedResult.away;
					nrOfTeamsMatches++;
				}
			}
		});
	});

	if (nrOfAllMatches == 0 || nrOfTeamsMatches == 0) return 0;
	let avgExpectedGoals = allExpectedGoals / nrOfAllMatches;

	let teamsAvgExpectedGoals = teamsExpectedGoals / nrOfTeamsMatches;

	return teamsAvgExpectedGoals - avgExpectedGoals;
}

function calcExpectedGoalDiff() {
	let homeTeamPerformance = calculatePerformance(match.teams.home);
	let awayTeamPerformance = calculatePerformance(match.teams.away);

	return homeTeamPerformance - awayTeamPerformance;
}

function calculatePerformance(team) {
	let marketValue = Math.log10(findMarketValue(team));
	let expectedGoalDiffCurrentForm = calcCurrentForm(team);
	let expectedGoalDiffOfCurrentSeason = calcExpectedGoalDiffOfSeasonOfTeam(seasons[seasonYear], team);
	let expectedGoalDiffOfLastSeasons = calcExpectedGoalDiffOfLastSeasonsOfTeam(team);

	return (
		factorMarketValue * marketValue +
		factorExpectedGoalDiffCurrentForm * expectedGoalDiffCurrentForm +
		factorExpectedGoalDiffOfCurrentSeason * expectedGoalDiffOfCurrentSeason +
		factorExpectedGoalDiffOfLastSeasons * expectedGoalDiffOfLastSeasons
	);
}

function findMarketValue(team) {
	try {
		return marketValues[seasonYear].find(t => t.name == team.name).marketValue;
	} catch (e) {
		console.log(team.name);
	}
}

function calcCurrentForm(team) {
	let expectedGoalDiff = 0;
	let nrOfMatches = 0;

	seasons[seasonYear].matchdays.forEach(md => {
		md.matches.forEach(m => {
			if (isMatchBeforeMatch(m, match)) {
				let matchdayDiff = match.matchdayNr - m.matchdayNr - 1;
				let factor = Math.pow(0.5, matchdayDiff);

				if (m.teams.home.name == team.name) {
					expectedGoalDiff += factor * (m.expectedResult.home - m.expectedResult.away);
					nrOfMatches++;
				} else if (m.teams.away.name == team.name) {
					expectedGoalDiff += factor * (m.expectedResult.away - m.expectedResult.home);
					nrOfMatches++;
				}
			}
		});
	});

	if (nrOfMatches == 0) return 0;
	return expectedGoalDiff / nrOfMatches;
}

function calcExpectedGoalDiffOfLastSeasonsOfTeam(team) {
	let expectedGoalDiffOfLastSeasons = [0.5, 0.35, 0.15]
		.map((f, i) => {
			return f * calcExpectedGoalDiffOfSeasonOfTeam(seasons[seasonYear + i + 1], team);
		})
		.reduce((a, b) => a + b);
	return expectedGoalDiffOfLastSeasons;
}

function calcExpectedGoalDiffOfSeasonOfTeam(season, team) {
	let expectedGoalDiff = 0;
	let nrOfMatches = 0;

	season.matchdays.forEach(md => {
		md.matches.forEach(m => {
			if (isMatchBeforeMatch(m, match)) {
				if (m.teams.home.name == team.name) {
					expectedGoalDiff += m.expectedResult.home - m.expectedResult.away;
					nrOfMatches++;
				} else if (m.teams.away.name == team.name) {
					expectedGoalDiff += m.expectedResult.away - m.expectedResult.home;
					nrOfMatches++;
				}
			}
		});
	});

	if (nrOfMatches == 0) return 0;
	return expectedGoalDiff / nrOfMatches;
}

function isMatchBeforeMatch(m1, m2) {
	if (m1.season == m2.season) return m1.matchdayNr < m2.matchdayNr;
	else return m1.season < m2.season;
}
