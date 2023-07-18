var population;
var generation = 1;
var populationSize = 500;
var stats;

function preload() {
	const url = `http://localhost:3000/`;
	let httpResults = makeAllHttpRequests(done);

	function done(httpResults) {
		httpResults.seasons.forEach(s => seasons.unshift(s));
		currentMatchday = httpResults.currentMatchday;

		seasonYear = 0;

		let o = calcEverything();
		console.log(
			seasons,
			'Total: ' + o.points,
			'points per match: ' + o.points / o.totalMatches,
			'iMatches: ' + o.totalMatches
		);

		let md = predictMatchday(currentMatchday, 0);
		outputMatchday(md);

		setInterval(doEverySecond, 1000);
	}
}

function outputMatchday(md) {
	console.log(md);
	let div = document.getElementById('results');
	let h1 = document.createElement('h1');
	h1.innerHTML = md.matchdayNr + '. Spieltag:';
	div.appendChild(h1);

	md.matches.forEach(m => {
		let p = document.createElement('p');
		p.innerHTML = `${m.teams.home.name} - ${m.teams.away.name}  ${m.tip.result.home}:${m.tip.result.away}`;
		div.appendChild(p);
	});
}

function setup() {
	population = new Population();
	stats = new Stats();
}

function doEverySecond() {
	if (seasons.length > 0) {
		population.evaluate();
	}
}

class Population {
	constructor() {
		this.machines = [];
		this.size = populationSize;
		this.matingPool = [];

		let genes = [];
		factors.forEach(fs => {
			for (let f in fs) {
				genes.push(fs[f]);
			}
		});

		this.machines.push(new Machine(genes));

		for (var i = 1; i < this.size; i++) {
			this.machines.push(new Machine());
		}
		this.evaluate = function() {
			stats.setGeneration(generation);
			// Calculate maximum fitness
			var maxFitness = 0;
			var bestGenes;
			for (var i = 0; i < this.size; i++) {
				this.machines[i].calcFitness();
				if (this.machines[i].fitness > maxFitness) {
					maxFitness = this.machines[i].fitness;
					bestGenes = this.machines[i].dna.genes;
				}
			}
			stats.setMaxFitness(maxFitness);
			stats.setBestGenes(bestGenes);
			// Calculate average fitness
			var sumFitness = 0;
			for (var i = 0; i < this.size; i++) {
				sumFitness += this.machines[i].fitness;
			}
			stats.setAvgFitness(sumFitness / this.size);
			// Fitness normalization fitness/maxFitness
			for (var i = 0; i < this.size; i++) {
				this.machines[i].fitness /= maxFitness;
				// this.machines[i].fitness = norm(this.machines[i].fitness, 0, 10)
			}
			this.matingPool = [];
			for (var i = 0; i < this.size; i++) {
				var n = this.machines[i].fitness * 100;
				for (var j = 0; j < n; j++) {
					this.matingPool.push(this.machines[i]);
				}
			}

			this.selection();
			generation++;
			console.log('_____________________');
		};

		this.selection = function() {
			let parentMachines = this.machines;

			parentMachines.sort((a, b) => b.fitness - a.fitness);

			this.machines = [];
			//sorted -> best 5% survive
			let iSurvivors = population.size * 0.05;
			for (var i = 0; i < iSurvivors; i++) {
				this.machines.push(parentMachines[i]);
			}

			//sorted -> best create offspring
			for (var i = 0; i < population.size - iSurvivors; i++) {
				var parentA = random(this.matingPool);
				var parentB = random(this.matingPool);
				var child = parentA.crossover(parentB);
				this.machines.push(child);
			}
		};
	}
}

class Machine {
	constructor(genes) {
		this.dna = new DNA(genes);
		this.fitness = 0;
	}

	crossover(partner) {
		var child = new Machine();

		var aMidPoints = this.createMidPoints();
		var currentMPIdx = 0;
		var currentParent = this;
		for (var i = 0; i < this.dna.length; i++) {
			var midPoint = aMidPoints[currentMPIdx];

			if (i >= midPoint) {
				currentMPIdx++;
				currentParent = this == currentParent ? partner : this;
			}

			child.dna.genes[i] = currentParent.dna.genes[i];
		}
		child.dna.mutation();

		return child;
	}

	createMidPoints() {
		var aMidPoints = [];
		var iMidPoints = round(max(1, randomGaussian(1.5, 1)));
		while (aMidPoints.length < iMidPoints) {
			var midPoint = floor(random(this.dna.length));
			if (aMidPoints.findIndex(mp => mp == midPoint) == -1) {
				aMidPoints.push(midPoint);
			}
		}

		aMidPoints.sort((a, b) => a - b);

		return aMidPoints;
	}

	calcFitness() {
		let i = 0;
		factors.forEach(o => {
			for (let fName in o) {
				o[fName] = this.dna.genes[i];
				i++;
			}
		});
		let o = calcEverything();
		this.fitness = o.points / o.totalMatches;
	}
}

class DNA {
	constructor(genes) {
		if (genes) {
			this.genes = genes;
		} else {
			this.genes = [];
			for (var i = 0; i < 16; i++) {
				this.genes[i] = Math.random();
			}
		}
	}

	get length() {
		return this.genes.length;
	}

	mutation() {
		for (var i = 0; i < this.length; i++) {
			if (Math.random() < 0.001) {
				this.genes[i] = Math.random();
			}
		}
	}
}

class Stats {
	constructor() {
		this.setMaxFitness = function(value) {
			console.log('max fitness: ' + value);
		};
		this.setAvgFitness = function(value) {
			console.log('avg fitness: ' + value);
		};
		this.setGeneration = function(value) {
			console.log('generation: ' + value);
		};
		this.setBestGenes = function(value) {
			console.log('bestGenes: ', value);
		};
	}
}
