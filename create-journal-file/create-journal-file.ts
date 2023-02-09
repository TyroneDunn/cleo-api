const fs = require('fs');
import { v4 as uuid } from "uuid";
import { Journal } from "../journal/journal";

function getUniqueJournalID() {
    return uuid();
};

function getUniqueJournal(name: string): Journal {
    const journal = {"id": getUniqueJournalID(), "name": name};
    return journal;
};

export function createJournalFile(args: CreateJournalFileArgs) {
    console.log("create journal stub.");
    const journal = getUniqueJournal(args.name);

    console.log(journal);

    const ws = fs.createWriteStream(args.path + journal.id + '.cleo');
    ws.write(JSON.stringify(journal));
    ws.end();
};

export type CreateJournalFileArgs = {
    name: string,
    path: string,
}