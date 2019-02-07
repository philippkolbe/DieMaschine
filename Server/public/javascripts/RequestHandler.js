const FileUpdater = require('./FileUpdater');

module.exports.handleSeveralRequests = async handler => {
    try {
        let arr = [];
        for (handler.i = handler.start; handler.i <= handler.end; handler.i++) {
            let data = await module.exports.handleRequest(handler);
            arr.push(JSON.parse(data));
        }
            
        return JSON.stringify(arr);
    } catch (err) {
        console.log(err);
    }
};

module.exports.handleRequest = async (handler) => {
    try {
        return JSON.stringify(await FileUpdater(handler));
    } catch (err) {
        console.log(err);
    }
};