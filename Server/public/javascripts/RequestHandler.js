const FileUpdater = require('./FileUpdater');

module.exports.handleSeveralRequests = async handler => {
    try {
        let promiseArr = [];
        console.log("hsr1", handler, typeof handler.i, handler.i, typeof handler.start, handler.start, typeof handler.end, handler.end);
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