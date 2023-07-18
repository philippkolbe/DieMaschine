const fs = require('./FileSystem.js');

module.exports = async handler => {
	try {
		let savedFile = await fs.getSavedFile(handler.fileName);
		if (isUpdateNeeded(savedFile)) {
			//File exists but needs update
			console.log(handler.fileName + ' needs update: ' + new Date(savedFile.lastUpdateDate));
			let newFileContent = await createNewFile(handler);
			return newFileContent;
		} else {
			//File exists and does not need update
			console.log(handler.fileName + ' does not need update: ' + new Date(savedFile.lastUpdateDate));
			return savedFile.content;
		}
	} catch (e) {
		//File does not exist
		let newFileContent = await createNewFile(handler);
		return newFileContent;
	}
};

module.exports.changeFile = async handler => {
	let savedSeasonFile;
	let seasonFileName = handler.seasonFileName;
	try {
		savedSeasonFile = await fs.getSavedFile(seasonFileName);
	} catch (e) {
		console.log('File ' + seasonFileName + ' does not exist -> Wont update that file');
	}
	if (savedSeasonFile) {
		console.log(handler.getNewSeasonContent(savedSeasonFile.content));
		let newSavedSeasonFileContent = handler.getNewSeasonContent(savedSeasonFile.content);
		await fs.writeFile(seasonFileName, JSON.stringify(createObj(newSavedSeasonFileContent)));
	}

	let savedMatchdayFile;
	let matchdayFileName = handler.matchdayFileName;
	try {
		savedMatchdayFile = await fs.getSavedFile(matchdayFileName);
	} catch (e) {
		console.log('File ' + matchdayFileName + ' does not exist -> Wont update that file');
	}
	if (savedMatchdayFile) {
		let newSavedMatchdayFileContent = handler.getNewMatchdayContent(savedMatchdayFile.content);
		await fs.writeFile(matchdayFileName, JSON.stringify(createObj(newSavedMatchdayFileContent)));
	}
};

async function createNewFile(handler) {
	let newFileContent = await writeNewFile(handler);
	console.log('Created new file: ' + handler.fileName);
	return newFileContent;
}

async function writeNewFile(handler) {
	let content = await handler.getContent();
	let obj = createObj(content);

	fs.writeFile(handler.fileName, JSON.stringify(obj));
	//console.log(`obj: ${JSON.stringify(obj.content)}`);
	return obj.content;
}

function isUpdateNeeded(obj) {
	return Date.now() - obj.lastUpdateDate > 60 * 60 * 1000;
}

function createObj(content) {
	return {
		lastUpdateDate: Date.now(),
		content: content
	};
}
