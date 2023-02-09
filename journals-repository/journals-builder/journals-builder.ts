const readJournalsFromDisk = require('../../read-journals-from-disk/read-journals-from-disk.ts');

export class JournalsBuilder {
    buildJournals(journalPath) {
        const journalsWrapper = readJournalsFromDisk.readJournalsFromDisk(journalPath);
        console.log('Wrapper Return Test: ' + journalsWrapper);
        return journalsWrapper;
    };
}; 
