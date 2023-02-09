const fs = require('fs');
const Journal = require('../journal/journal.ts');

export function readJournalsFromDisk(path) {
    let journals = [];
    const files = fs.readdirSync(path);
    console.log(files);
    const fileData = files
    .map((filePath) => {
        if (filePath !== ''){
            const jsonString = fs.readFileSync(path + filePath).toString()
            return JSON.parse(jsonString);
        }
    })
    .filter(item => !!item)
    console.log('File Data: ', fileData);
    return fileData;
}; 
