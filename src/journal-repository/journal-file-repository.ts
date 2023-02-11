import {Journal} from "../journal/journal";
import {JournalEntry} from "../journal/journal-entry";
import {JournalRepository} from "./journal-repository";
import {v4 as uuid} from "uuid";
import {JournalEntryKey} from "../journal/journal-entry-key";
import * as fs from "fs";

export class JournalsFileRepository implements JournalRepository {
    private journalPath = '/home/dunnt/Documents/cleo-data/journals/';
    private journalEntriesPath = '/home/dunnt/Documents/cleo-data/journal-entries/';
    private journalEntryKeysPath = '/home/dunnt/Documents/cleo-data/journal-entry-keys/';

    async getJournals(): Promise<Journal[]> {
        const filePaths = await this.getFilesFromDirectory(this.journalPath);
        return this.getJournalsFromJournalFiles(filePaths);
    };

    private getJournalsFromJournalFiles(journalFilePaths: string[]): Promise<Journal[]> {
        return new Promise<Journal[]>((resolve) => {
            const journalsData: string[] = journalFilePaths.map(journalFilePath => {
                return fs.readFileSync(this.journalPath+journalFilePath).toString();
            });
            const journals: Journal[] = journalsData.map(data => {
                return {id: JSON.parse(data).id, name: JSON.parse(data).name};
            });
            resolve(journals);
        });
    }

    async getJournal(id: string): Promise<Journal[]> {
        return new Promise<Journal[]>((resolve, reject) => {
            this.getJournals().then((journals) => {
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
        const journal = {
            "id": this.getUUID(),
            "name": name
        };
        await this.writeJournalToFile(journal);
        return Promise.resolve();
    }

    private writeJournalToFile(journal: Journal): Promise<void> {
        try {
            const ws = fs.createWriteStream(this.journalPath + journal.id + '.cleo');
            ws.write(JSON.stringify(journal));
            ws.end();
            return Promise.resolve();
        } catch (err) {
            return Promise.reject(err);
        }
    }
    private getUUID(): string {
        return uuid();
    }

    async deleteJournal(id: string): Promise<void> {
        fs.unlink(this.journalPath+id+'.cleo', (err) => {
        if (err)
            return Promise.reject(err);
        else
            return Promise.resolve();
        })
    }

    getEntry(journalid: string, id: string): Promise<JournalEntry[]> {
        return new Promise<JournalEntry[]>(async (resolve, reject) => {
            try {
                const entries = await this.getEntries(journalid);
                const entry = entries.filter(entry => { return entry.id === id; });
                resolve(entry);
            } catch (e) {
                reject(e);
            }
        });
    }

    async getEntries(journalid: string): Promise<JournalEntry[]> {
        return new Promise<JournalEntry[]>(async (resolve, reject) => {
            const journalExists = await this.journalExists(journalid);
            if (journalExists) {
                try {
                   const journalEntryKeyFiles = await this.getFilesFromDirectory(this.journalEntryKeysPath);
                   const journalEntryKeys = await this.getJournalEntriesKeysFromJournalEntryKeyFiles(journalEntryKeyFiles);
                   const filteredJournalEntryKeys = journalEntryKeys
                       .filter(key => {
                           if (key.journalid === journalid)
                               return key;
                       });
                   const entries: JournalEntry[] = filteredJournalEntryKeys
                       .map(key => {
                           return this.getJournalEntryFromFile(key.entryid);
                       });
                   resolve(entries);
               } catch (e) {
                   reject(e);
               }
           } else {
               reject();
           }
       });
    }

    private getJournalEntryFromFile(entryid: string): JournalEntry {
        const data = fs.readFileSync(this.journalEntriesPath+entryid+'.cleo').toString();
        return {
            id: JSON.parse(data).id,
            body: JSON.parse(data).body,
            date: JSON.parse(data).date,
        };
    }

    private getFilesFromDirectory(path: string): Promise<string[]> {
        return new Promise<string[]>((resolve, reject) => {
            fs.readdir(path, (err, files) => {
                if (err) {
                    reject(err);
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

    private getJournalEntriesKeysFromJournalEntryKeyFiles(journalEntryKeyFiles: string[]): Promise<JournalEntryKey[]> {
        return new Promise<JournalEntryKey[]>((resolve) => {
            const journalEntryKeysData: string[] = journalEntryKeyFiles
                .map(filePath => {
                    return fs.readFileSync(this.journalEntryKeysPath+filePath).toString();
                });

            const keys: JournalEntryKey[] = journalEntryKeysData.map(data => {
                return {
                    id: JSON.parse(data).id,
                    entryid: JSON.parse(data).entryid,
                    journalid: JSON.parse(data).journalid,
                }
            });
            resolve(keys);
        });
    }

    async createEntry(journalID: string, body: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.journalExists(journalID).then(async (journalExists) => {
                if (journalExists) {
                    const entry: JournalEntry = this.createNewEntry(body);
                    const key: JournalEntryKey = this.createJournalEntryKey(journalID, entry.id);
                    await this.writeEntryToFile(entry);
                    await this.writeJournalEntryKeyToFile(key);
                    resolve();
                } else {
                    reject();
                }
            }).catch(() => {
                console.log('journal does not exist.');
                reject();
            })
        });
    }
    private journalExists(journalID: string): Promise<boolean> {
        return new Promise<boolean>(resolve => {
            this.getJournal(journalID).then(() => {
                resolve(true);
            }).catch(() => {
                resolve(false);
            })
        })
    }

    private createNewEntry(body: string): JournalEntry {
        return {
            "id": this.getUUID(),
            "date": Date.now(),
            "body": body,
        };
    }

    private createJournalEntryKey(journalID: string, entryID: string): JournalEntryKey {
        return {"id": this.getUUID(), "journalid": journalID, "entryid": entryID};
    }

    private async writeEntryToFile(entry: JournalEntry): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            try {
                const ws = fs.createWriteStream(this.journalEntriesPath + entry.id + '.cleo');
                ws.write(JSON.stringify(entry));
                ws.end();
                resolve();
            } catch (err) {
                reject();
            }
        });
    }

    private writeJournalEntryKeyToFile(key: JournalEntryKey): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            try {
                const ws = fs.createWriteStream(this.journalEntryKeysPath+key.id+'.cleo');
                ws.write(JSON.stringify(key));
                ws.end();
                resolve();
            } catch (err) {
                reject();
            }
        });
    }
}




