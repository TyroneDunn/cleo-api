const fs = require('fs');
const v4 = require('uuid');
const  Journal = require('../journal/journal.ts');

function getUniqueJournalID() {
    return v4();
};

function getUniqueJournal(name) {
    return new Journal(getUniqueJournalID(), name);
};

export function createJournalFile(args) {
    console.log("create journal stub.");
    const journal = getUniqueJournal(args.name);
    const ws = fs.createWriteStream(args.path + journal.id + '.cleo');
    ws.write(JSON.stringify(journal));
    ws.end();
};