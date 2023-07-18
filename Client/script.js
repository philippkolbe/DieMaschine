let seasons = [];
let currentMatchday;

function calcEverything() {
	let tendency = 0;
	let goalDiff = 0;
	let result = 0;
	let totalMatches = 0;
	let points = 0;

	seasons.forEach((s, iS) => {
		if (iS < seasons.length - 3) {
			let o = calcSeason(s, iS);
			tendency += o.tendency;
			goalDiff += o.goalDiff;
			result += o.result;
			totalMatches += o.totalMatches;
			points += o.points;
		}
	});
	let obj = {
		tendency: tendency / totalMatches,
		goalDiff: goalDiff / totalMatches,
		result: result / totalMatches,
		points,
		totalMatches
	};
	return obj;
}

function calcSeason(s, iS) {
	let seasonPoints = 0;
	let seasonTendency = 0;
	let seasonGoalDiff = 0;
	let seasonResult = 0;
	let seasonTotalMatches = 0;
	s.matchdays.forEach(md => {
		predictMatchday(md, iS);
		seasonTotalMatches += md.matches.length;
	});

	s.matchdays.forEach(md => {
		md.matches.forEach(m => {
			if (!m.result) {
				console.log(m);
			}
			let actualTendencyName =
				m.result.home > m.result.away
					? 'homeTeamWins'
					: m.result.away > m.result.home ? 'awayTeamWins' : 'draw';
			let actualGoalDiff = Math.abs(m.result.home - m.result.away);

			if (actualTendencyName == m.tip.tendencyName) {
				seasonTendency++;
				seasonPoints += 2;
				if (m.result.away > m.result.home) seasonPoints += 1;

				if (actualGoalDiff == m.tip.goalDiff) {
					seasonGoalDiff++;
					seasonPoints += 2;
					if (m.result.home == m.tip.result.home && m.result.away == m.tip.result.away) {
						seasonResult++;
						seasonPoints += 1;
					}
				}
			}
		});
	});
	let obj = {
		points: seasonPoints,
		tendency: seasonTendency,
		goalDiff: seasonGoalDiff,
		result: seasonResult,
		totalMatches: seasonTotalMatches
	};

	return obj;
}

function predictMatchday(md, seasonIdx) {
	let mdNr = md.matchdayNr;
	setFactors(mdNr);

	seasonYear = seasonIdx;
	let matchdayTips = [];
	md.matches.forEach(m => {
		match = m;
		let probabilities = calcTipForMatch(m);

		let sorted = {homeTeamWins: [], draw: [], awayTeamWins: []};
		sorted.homeTeamWins.p = 0;
		sorted.draw.p = 0;
		sorted.awayTeamWins.p = 0;
		probabilities.homeTeamProbabilities.forEach((p1, i1) => {
			probabilities.awayTeamProbabilities.forEach((p2, i2) => {
				let goalDiffIdx = Math.abs(i1 - i2);
				let homeTeamGoals = i1;
				let p = p1 * p2;
				let goalDiffArr;
				if (i1 > i2) goalDiffArr = sorted.homeTeamWins;
				else if (i1 == i2) goalDiffArr = sorted.draw;
				else if (i1 < i2) goalDiffArr = sorted.awayTeamWins;

				if (!Array.isArray(goalDiffArr[goalDiffIdx])) {
					goalDiffArr[goalDiffIdx] = [];
					goalDiffArr[goalDiffIdx].p = 0;
				}
				goalDiffArr[goalDiffIdx][homeTeamGoals] = p;
				goalDiffArr[goalDiffIdx].p += p;
				goalDiffArr.p += p;
			});
		});

		let allTips = [];
		['homeTeamWins', 'draw', 'awayTeamWins'].forEach(tendencyName => {
			let awayBonus = new Number(tendencyName == 'awayTeamWins');
			let tendencyArr = sorted[tendencyName];
			let tendencyP = sorted[tendencyName].p;

			tendencyArr.forEach((goalDiffArr, goalDiff) => {
				let goalDiffP = goalDiffArr.p;

				goalDiffArr.forEach((resultP, homeTeamGoals) => {
					let result =
						tendencyName == 'homeTeamWins'
							? {home: homeTeamGoals, away: homeTeamGoals - goalDiff}
							: {home: homeTeamGoals, away: homeTeamGoals + goalDiff};
					allTips.push({
						result,
						goalDiff,
						tendencyName,
						p: tendencyP * (2 + awayBonus) + goalDiffP * (4 + awayBonus) + resultP * (5 + awayBonus)
					});
				});
			});
		});

		allTips.sort((a, b) => b.p - a.p);
		let bestTip = allTips[0];
		let secondBestTip = allTips[1];

		if (secondBestTip.result.home == bestTip.result.away && secondBestTip.result.away == bestTip.result.home)
			secondBestTip = allTips[2];

		matchdayTips.push({match: m, bestTip, secondBestTip});
	});

	let results = {};
	matchdayTips.forEach(mTip => {
		let rName =
			Math.max(mTip.bestTip.result.home, mTip.bestTip.result.away) +
			':' +
			Math.min(mTip.bestTip.result.home, mTip.bestTip.result.away);
		let arr = results[rName];
		if (!arr) {
			arr = [];
			results[rName] = arr;
		}

		arr.push(mTip);
	});

	for (let rName in results) {
		let r = results[rName];
		let nrOfTooMany = Math.max(0, r.length - 6);
		r.sort((a, b) => a.bestTip.p - b.bestTip.p);
		r.forEach((mTip, i) => {
			if (i < nrOfTooMany) mTip.match.tip = mTip.secondBestTip;
			else mTip.match.tip = mTip.bestTip;
		});
	}

	return md;
}

function setFactors(mdNr) {
	let i = calculateIdxOfFactors(mdNr);

	factorExpectedGoalDiffCurrentForm = factors[i].factorExpectedGoalDiffCurrentForm;
	factorExpectedGoalDiffOfCurrentSeason = factors[i].factorExpectedGoalDiffOfCurrentSeason;
	factorExpectedGoalDiffOfLastSeasons = factors[i].factorExpectedGoalDiffOfLastSeasons;
	factorExpectedGoalsPerMatchOfLastSeasons = factors[i].factorExpectedGoalsPerMatchOfLastSeasons;
	factorExpectedGoalsPerMatchOfThisSeason = factors[i].factorExpectedGoalsPerMatchOfThisSeason;
	factorHomeAdvantageOfCurrentSeason = factors[i].factorHomeAdvantageOfCurrentSeason;
	factorHomeAdvantageLastSeasons = factors[i].factorHomeAdvantageLastSeasons;
	factorMarketValue = factors[i].factorMarketValue;
}

function calculateIdxOfFactors(mdNr) {
	if (mdNr <= 5) return 0;
	else if (mdNr <= 17) return 1;
	else return 2;
}

Math.faculty = n => {
	return n <= 1 ? 1 : n * Math.faculty(n - 1);
};
