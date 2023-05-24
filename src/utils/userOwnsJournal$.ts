import {User} from '../user/user.type';
import {Journal} from '../journal/journal.type';
import {map, Observable} from "rxjs";
import {Journal$} from "../journal/journal$.type"

export const userOwnsJournal$ = (
    user: User, 
    journalId: string, 
    journal$: Journal$,
): Observable<boolean> => {
    return journal$(journalId).pipe(
        map((journal: Journal | undefined): boolean => {
            if (!journal)
                return false;

            return(journal.author.toString() === user._id.toString());
        })
    );
}