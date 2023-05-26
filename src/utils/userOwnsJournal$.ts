import {User} from '../user/user.type';
import {Journal} from '../journal/journal.type';
import {Journal$} from "../journal/journals$.type"
import {map, Observable} from "rxjs";

export const userOwnsJournal$ = (
    userId: string,
    journalId: string,
    journal$: Journal$,
): Observable<boolean> => {
    return journal$(journalId).pipe(
        map((journal: Journal | undefined): boolean => {
            if (!journal)
                return false;

            return(journal.author.toString() === userId);
        })
    );
}