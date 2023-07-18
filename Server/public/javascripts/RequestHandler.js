const FileUpdater = require('./FileUpdater');
const fs = require('./FileSystem');

module.exports.handleSeveralRequests = async handler => {
	try {
		let promiseArr = [];
		for (handler.i = handler.start; handler.i <= handler.end; handler.i++) {
			let data = await module.exports.handleRequest(handler);
			promiseArr.push(JSON.parse(data));
		}
		let arr = await Promise.all(promiseArr);

		return JSON.stringify(arr);
	} catch (err) {
		console.log(err);
	}
};

module.exports.handleRequest = async handler => {
	try {
		return JSON.stringify(await FileUpdater(handler));
	} catch (err) {
		console.log(err);
	}
};

module.exports.handlePostRequest = async handler => {
	try {
		let res = await fs.writeFile(handler.fileName, handler.getContent());

		await FileUpdater.changeFile(handler);

		return res;
	} catch (err) {
		console.log(err);
	}
};
