import {Journal} from "../journal/journal";
import {JournalRepository} from "./journal-repository";
import * as fs from "fs";
import {v4 as uuid} from "uuid";

export class JournalsFileRepository implements JournalRepository {
    journalPath = '/home/dunnt/Documents/cleo-data/journals/';
    async getJournals(): Promise<Journal[]> {
        return this.readJournalsFromDisk();
    };

    private readJournalsFromDisk(): Promise<Journal[]> {
        return new Promise<Journal[]>((resolve, reject) => {
            fs.readdir(this.journalPath, (err, files) => {
                if (err) {
                    return reject();
                } else {
                    const fileData: Journal[] =
                        files.filter((file) => {
                            return (file !== '');
                        }).map((filePath) => {
                            fs.readFile(this.journalPath+filePath,(err, data) => {
                                if (err) {
                                    console.log('Error Reading Data from File Path: ', filePath, err);
                                } else {
                                    return data.toString();
                                }
                            });
                            const jsonString = fs.readFileSync(this.journalPath + filePath).toString();
                            return JSON.parse(jsonString);
                        });
                    return resolve(fileData);
                }
            })
        });
    }

    async getJournal(id: string): Promise<Journal[]> {
        return new Promise<Journal[]>((resolve, reject) => {
            this.readJournalsFromDisk().then((journals) => {
                const journal = journals.filter((journal) => {
                    return journal.id === id;
                });
                if (!journal.length) {
                    reject();
                } else {
                    resolve(journal);
                }
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




