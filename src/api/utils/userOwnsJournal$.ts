import {User} from '../user/user.type';
import {Journal} from '../journal/journal.type';
import {map, Observable} from "rxjs";

export function userOwnsJournal$(user: User, journalId: string): Observable<boolean> {
    return this.journalRepository.journal$(journalId).pipe(
        map((journal: Journal | undefined): boolean => {
            if (!journal)
                return false;

            return(journal.author.toString() === user._id.toString());
        })
    );
}
