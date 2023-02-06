import fs from 'fs'

function readJournalsFromDisk() {
    let journals = [];
    const journalsPath = "/home/dunnt/Documents/cleo-data/journals";
    fs.readdir(journalsPath, (err, files) => {
        console.log(files)
        files.forEach(file => {
            // Create a Journal using the file, and add it to the journals array
        });
    });
    return journals;
}

export class JournalsBuilder {
    buildJournals() {
        let journals = [];
        return journals.concat(readJournalsFromDisk());
    };
}; 
