import {Journal} from '../journal/journal.type';

export const userOwnsJournal = (
    userId: string,
    journal: Journal | undefined,
): boolean => {
    if (!journal)
        return false;

    return(journal.author.toString() === userId);
}