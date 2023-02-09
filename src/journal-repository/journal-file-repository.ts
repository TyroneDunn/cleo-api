import {Journal} from "../journal/journal";
import {JournalRepository} from "./journal-repository";
import {JournalsBuilder} from "./journals-builder/journals-builder";
import {v4 as uuid} from "uuid";
import * as fs from "fs";

export class JournalsFileRepository implements JournalRepository {
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

    deleteJournal(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    //     get journal
    //     if journal exists
    //     delete journal file
    }

    async createJournal(name: string): Promise<void> {
        const journal = this.getUniqueJournal(name);
        const ws = fs.createWriteStream(this.journalPath + journal.id + '.cleo');
        ws.write(JSON.stringify(journal));
        ws.end();
        return Promise.resolve();
    };

    private getUniqueJournal(name: string): Journal {
        return {
            "id": this.getUniqueJournalID(),
            "name": name
        };
    }

    private getUniqueJournalID() {
        return uuid();
    }
}