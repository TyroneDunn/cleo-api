import {createJournalFile} from "../create-journal-file/create-journal-file";
import {Journal} from "../journal/journal";
import {JournalRepository} from "./journal-repository";
import {JournalsBuilder} from "./journals-builder/journals-builder";

export class JournalsFileRepository implements JournalRepository {
    deleteJournal(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    journalPath = '/home/dunnt/Documents/cleo-data/journals/';

    async getJournals(): Promise<Journal[]> {
        return new JournalsBuilder().buildJournals(this.journalPath);
    };

    getJournal(id: string): Promise<Journal> {
        return new JournalsBuilder().buildJournals(this.journalPath)
            .filter((journal) => {
                return journal.id === id;
            });
    }

    async createJournal(name: string): Promise<void> {
        return Promise.resolve(createJournalFile({path: this.journalPath, name: name}));
    };
}