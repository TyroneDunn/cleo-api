import fs from 'fs';
import { v4 as uuid } from 'uuid';
import { Journal } from '../journal/journal.js';

function getUniqueJournalID() {
    return uuid();
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