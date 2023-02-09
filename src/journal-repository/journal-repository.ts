import { createJournalFile } from "../create-journal-file/create-journal-file.ts";
import { Journal } from "../journal/journal.ts";
import { JournalsBuilder } from "./journals-builder/journals-builder.ts";

export class JournalsFileRepository implements JournalRepository{
    journalPath = '/home/dunnt/Documents/cleo-data/journals/';

    async getJournals(): Promise<Journal[]> {
        const journalsWrapper = new JournalsBuilder().buildJournals(this.journalPath);
        console.log('JR Wrapper Return Test: ' + journalsWrapper);
        return journalsWrapper;
    };

    async createJournal(name: string): Promise<void> {
        return Promise.resolve(createJournalFile({path: this.journalPath, name: name}));
    };
};


export interface JournalRepository {
    getJournals(): Promise<Journal[]>;
    createJournal(name: string): Promise<void>;
};