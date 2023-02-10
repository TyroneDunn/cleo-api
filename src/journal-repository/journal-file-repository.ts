import {Journal} from "../journal/journal";
import {JournalRepository} from "./journal-repository";
import * as fs from "fs";
import {readFileSync} from "fs";
import {v4 as uuid} from "uuid";

export class JournalsFileRepository implements JournalRepository {
    journalPath = '/home/dunnt/Documents/cleo-data/journals/';
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
}




