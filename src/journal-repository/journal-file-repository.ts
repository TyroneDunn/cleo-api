import {Journal} from "../journal/journal";
import {JournalEntry} from "../journal/journal-entry";
import {JournalRepository} from "./journal-repository";
import * as fs from "fs";
import {readFileSync} from "fs";
import {v4 as uuid} from "uuid";

export class JournalsFileRepository implements JournalRepository {
    journalPath = '/home/dunnt/Documents/cleo-data/journals/';
    journalEntriesPath = '/home/dunnt/Documents/cleo-data/journal-entries/';

    async getJournals(): Promise<Journal[]> {
        return this.readJournalsFromDisk();
    };
    private readJournalsFromDisk(): Promise<Journal[]> {
        return new Promise<Journal[]>((resolve, reject) => {
            this.getFilesFromDirectory(this.journalPath).then(journalFiles => {
                this.getJournalsFromJournalFiles(journalFiles).then((journals => {
                    resolve(journals);
                })).catch(() => {
                    reject();
                })
            }).catch(() => {
                reject();
            })
        });
    };

    private getFilesFromDirectory(path: string): Promise<string[]> {
        return new Promise<string[]>((resolve, reject) => {
            fs.readdir(path, (err, files) => {
                if (err) {
                    reject();
                } else {
                    const journalPaths: string[] =
                        files.filter((file) => {
                            return (file !== '');
                        });
                    resolve(journalPaths);
                }
            })
        });
    }

    private getJournalsFromJournalFiles(journalFilePaths: string[]): Promise<Journal[]> {
        return new Promise<Journal[]>((resolve, reject) => {
            const journalsData: string[] = journalFilePaths.map(journalFilePath => {
                return readFileSync(this.journalPath+journalFilePath).toString();
            });

            const journals: Journal[] = journalsData.map(data => {
                return {id: JSON.parse(data).id, name: JSON.parse(data).name};
            });

            resolve(journals);
        });
    }

    async getJournal(id: string): Promise<Journal[]> {
        return new Promise<Journal[]>((resolve, reject) => {
            this.readJournalsFromDisk().then((journals) => {
                const journal = journals.filter((journal) => {
                    return journal.id === id;
                });
                if (!journal.length)
                    reject();
                else
                    resolve(journal);
            })
        });
    }

    async createJournal(name: string): Promise<void> {
        const journal = this.createNewJournal(name);
        return this.writeJournalToFile(journal);
    }

    private writeJournalToFile(journal: Journal): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            try {
                const ws = fs.createWriteStream(this.journalPath + journal.id + '.cleo');
                ws.write(JSON.stringify(journal));
                ws.end();
                resolve();
            } catch (err) {
                reject();
            }
        });
    }

    private createNewJournal(name: string): Journal {
        return {
            "id": this.getUniqueJournalID(),
            "name": name
        };
    }

    private getUniqueJournalID(): string {
        return uuid();
    }

    async deleteJournal(id: string): Promise<void> {
        return new Promise((resolve, reject) => {
            fs.unlink(this.journalPath+id+'.cleo', (err) => {
                if (err) {
                    reject();
                } else {
                    resolve();
                }
            })
        });
    }

    private async getEntries(): Promise<JournalEntry[]> {
       return new Promise<JournalEntry[]>((resolve, reject) => {
            this.getFilesFromDirectory(this.journalEntriesPath).then(journalEntryFiles => {
                this.getJournalEntriesFromJournalEntryFiles(journalEntryFiles).then(journalEntries => {
                    resolve(journalEntries);
                }).catch(() => {
                    reject();
                })
            })
       });
    }
    getEntry(id: string): Promise<JournalEntry[]> {
        return new Promise<JournalEntry[]>((resolve, reject) => {
            this.getEntries().then((entries) => {
                const entry = entries.filter((entry) => {
                    return entry.id === id;
                });
                if (!entry.length)
                    reject();
                else
                    resolve(entry);
            })
        });
    }

    private getJournalEntriesFromJournalEntryFiles(journalEntryFilePaths: string[]): Promise<JournalEntry[]> {
        return new Promise<JournalEntry[]>((resolve, reject) => {
            const journalEntriesData: string[] = journalEntryFilePaths.map(journalEntryFilePath => {
                return readFileSync(this.journalEntriesPath+journalEntryFilePath).toString();
            });

            const journalEntries: JournalEntry[] = journalEntriesData.map(data => {
                return {id: JSON.parse(data).id, body: JSON.parse(data).body, date: JSON.parse(data).date};
            });

            resolve(journalEntries);
        });
    }
}




