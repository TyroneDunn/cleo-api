import {User} from '../user/user.type';
import {Journal} from '../journal/journal.type';
import {JournalRepository} from '../journal/journal-repository.type';
import {map, Observable} from "rxjs";

export function userOwnsJournal$(user: User, journalId: string, journalRepository: JournalRepository): Observable<boolean> {
    return journalRepository.journal$(journalId).pipe(
        map((journal: Journal | undefined): boolean => {
            if (!journal)
                return false;

            return(journal.author.toString() === user._id.toString());
        })
    );
}
