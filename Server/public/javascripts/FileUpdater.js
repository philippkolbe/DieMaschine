const fs = require('./FileSystem.js');

module.exports = async handler => {
    let savedFile;
    if (fs.isFileCreated(handler.fileName)) {
        savedFile = fs.getSavedFile(handler.fileName);
        //console.log(`savedFile: ${savedFile.content}`);
    }

    if (savedFile == undefined || isUpdateNeeded(savedFile)) {
        let content = await handler.getContent();
        let obj = createObj(content);

        fs.writeFile(handler.fileName, JSON.stringify(obj));
        //console.log(`obj: ${obj.content}`);
        return obj.content;
    } else {
        return savedFile.content;
    }
}

function isUpdateNeeded(obj) {
    return (Date.now() - obj.updateDate > 24*60*60*1000);
}

function createObj(content) {
    return {
        lastUpdateDate: Date.now(),
        content: content
    };
}