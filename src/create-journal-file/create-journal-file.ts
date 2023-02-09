const fs = require('fs');
import {v4 as uuid} from "uuid";
import {Journal} from "../journal/journal";

function getUniqueJournalID() {
    return uuid();
}

function getUniqueJournal(name: string): Journal {
    return {"id": getUniqueJournalID(), "name": name};
}

export function createJournalFile(args: CreateJournalFileArgs) {
    const journal = getUniqueJournal(args.name);
    const ws = fs.createWriteStream(args.path + journal.id + '.cleo');
    ws.write(JSON.stringify(journal));
    ws.end();
}

export type CreateJournalFileArgs = {
    name: string,
    path: string,
}