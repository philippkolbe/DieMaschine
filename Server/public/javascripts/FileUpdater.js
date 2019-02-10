const fs = require('./FileSystem.js');

module.exports = async handler => {
    try {
        //console.log("FileUpdater: " + handler.fileName);
        let savedFile = await fs.getSavedFile(handler.fileName);
        //console.log(`savedFile: ${savedFile.content}`);
        if (isUpdateNeeded(savedFile)) {
            let newFileContent = await writeNewFile(handler);
            return newFileContent;
        } else {
            return savedFile.content;
        }
    } catch (e) { //File does not exist
        let newFileContent = await writeNewFile(handler);
        return newFileContent;
    }
}

async function writeNewFile(handler) {
    let content = await handler.getContent();
    let obj = createObj(content);

    fs.writeFile(handler.fileName, JSON.stringify(obj));
    //console.log(`obj: ${JSON.stringify(obj.content)}`);
    return obj.content;
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