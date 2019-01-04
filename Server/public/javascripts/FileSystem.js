
const fs = require('fs');

const filesDir = '../../files/';

module.exports.getSavedFile = async (name) => {
    return new Promise((resolve, reject) => {
        fs.ReadStream(filesDir + name, (err, data) => {
            if (err)
                reject(new Error(err.message));
            resolve(data);
        });
    });
}

module.exports.isFileCreated = async (name) => {
    return new Promise((resolve, reject) => {
        fs.stat(filesDir + name, (err, stat) => {
            if(err == null)
                resolve(true);
            else 
                resolve(false);
        });
    });
}

module.exports.writeFile = async (name, content) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(filesDir + name + ".txt", content, (err) => {
            if (err)
                reject(err.message);
            else
                resolve();
        });
    });
}