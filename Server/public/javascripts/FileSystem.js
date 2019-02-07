
const fs = require('fs');

const filesDir = './data/';

module.exports.getSavedFile = name => {
    return JSON.parse(fs.readFileSync(filesDir + name + '.json'));
};

module.exports.isFileCreated = name => {
    return fs.existsSync(filesDir + name + '.json');
};

module.exports.writeFile = async (name, content) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(filesDir + name + ".json", content, err => {
            if (err)
                reject(err.message);
            else
                resolve();
        });
    });
};