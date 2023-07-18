module.exports = class {
	constructor(team) {
		this.name = team.name;
		this.logo = team.logo;
		this.points = 0;
		this.goals = 0;
		this.goalsAgainst = 0;
		this.nrOfMatches = 0;
		this.goalDifference = 0;
	}

	addPoints(points) {
		this.points += points;
	}

	addGoals(goals) {
		this.goals += goals;
		this.goalDifference += goals;
	}

	addGoalsAgainst(goals) {
		this.goalsAgainst += goals;
		this.goalDifference -= goals;
	}

	addMatch() {
		this.nrOfMatches++;
	}
};
