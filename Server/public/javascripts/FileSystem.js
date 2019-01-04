
const fs = require('fs');

const filesDir = './files/';

module.exports.getSavedFile = (name) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filesDir + name + '.json', (err, data) => {  
            if (err)
                reject(err);
            resolve(data);
        });
    });
}

module.exports.isFileCreated = (name) => {
    return new Promise((resolve, reject) => {
        fs.stat(filesDir + name + '.json', (err, stat) => {
            if(err == null)
                resolve(true);
            else 
                resolve(false);
        });
    });
}

module.exports.writeFile = async (name, content) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(filesDir + name + ".json", content, (err) => {
            if (err)
                reject(err.message);
            else
                resolve();
        });
    });
}