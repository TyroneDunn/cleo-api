import { createJournalFile } from "../create-journal-file/create-journal-file.js";
import { JournalsBuilder } from "./journals-builder/journals-builder.js";

export class JournalsRepository {
    journalPath = '/home/dunnt/Documents/cleo-data/journals/';

    getJournals() {
        return new JournalsBuilder().buildJournals();
    };

    createJournal(name) {
        createJournalFile({path: this.journalPath, name: name});
    };
};
