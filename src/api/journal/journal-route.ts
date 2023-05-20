import {
    HTTP_STATUS_BAD_REQUEST,
    HTTP_STATUS_CREATED,
    HTTP_STATUS_NOT_FOUND,
    HTTP_STATUS_OK,
    HTTP_STATUS_UNAUTHORIZED,
    HTTP_STATUS_INTERNAL_SERVER_ERROR,
} from "../../utils/environment";
import {RequestHandler, Router} from "express";
import {JournalRepository} from "./journal-repository.type";
import {User} from "../user/user.type";
import {Journal} from "./journal.type"
import {combineLatest, map, Observable} from "rxjs";

export class JournalRoute {
    public readonly router: Router = Router();
    constructor(private journalRepository: JournalRepository) {
        this.router.get('/:id', this.journal$);
        this.router.get('/', this.journals$);
        this.router.post('/', this.createJournal$);
        this.router.delete('/:id', this.deleteJournal$);
        this.router.patch('/:id', this.updateJournal$);
    }

    private journal$: RequestHandler = async (req, res) => {
        const id = req.params.id;
        if (!id) {
            res.status(HTTP_STATUS_BAD_REQUEST)
                .json(`ID required.`);
            return;
        }

        this.journalRepository.journalExists$(id).subscribe((journalExists) => {
            if (!journalExists) {
                res.status(HTTP_STATUS_NOT_FOUND)
                    .json(`Journal ${id} not found.`);
                return;
            }
        })

        this.journalRepository.journal$(id).subscribe((journal: Journal) => {
            if (!journal) {
                res.status(HTTP_STATUS_NOT_FOUND).json(`Journal ${id} not found.`);
                return;
            }

            res.json(journal);
        });
    }

    private journals$: RequestHandler = async (req, res) => {
        this.journalRepository.journals$((req.user as User)._id)
            .subscribe((journals: Journal[]) => {
                res.json(journals);
            });
    };

    private createJournal$: RequestHandler = async (req, res) => {
        if (!(req.body.name as string)){
            res.status(HTTP_STATUS_BAD_REQUEST)
                .json('Journal name required.');
            return;
        }

        this.journalRepository.createJournal$((req.user as User)._id, req.body.name)
            .subscribe((journal: Journal) => {
                res.status(HTTP_STATUS_CREATED)
                    .json(journal);
            });
    };

    private deleteJournal$: RequestHandler = async (req, res) => {
        combineLatest([
            this.journalRepository.journalExists$(req.params.id),
            this.userOwnsJournal$((req.user as User), req.params.id)
        ]).pipe(map(([journalExists, ownsJournal]) => {
            if (!req.params.id) {
                res.status(HTTP_STATUS_BAD_REQUEST)
                    .json(`Journal id required.`);
                return;
            }

            if (!journalExists) {
                res.status(HTTP_STATUS_NOT_FOUND)
                    .json(`Journal ${(req.params.id)} not found.`);
                return;
            }

            if (!ownsJournal) {
                res.status(HTTP_STATUS_UNAUTHORIZED)
                    .json(`Unauthorized access to journal ${(req.params.id)}.`);
                return;
            }

            this.journalRepository.deleteJournal$(req.params.id).subscribe((journal) => {
                if (!journal) {
                    res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
                        .json(`Journal ${(req.params.id)} not deleted.`);
                    return;
                }
                res.status(HTTP_STATUS_OK).json(`Journal ${(req.params.id)} deleted.`);
            });
        })).subscribe();
    };

    private updateJournal$: RequestHandler = async (req, res) => {
        combineLatest([
            this.journalRepository.journalExists$(req.params.id),
            this.userOwnsJournal$((req.user as User), req.params.id)
        ]).pipe(map(([journalExists, ownsJournal]) => {
            if (!req.params.id) {
                res.status(HTTP_STATUS_BAD_REQUEST)
                    .json(`Journal id required.`);
                return;
            }

            if (!journalExists) {
                res.status(HTTP_STATUS_NOT_FOUND)
                    .json(`Journal ${(req.params.id)} not found.`);
                return;
            }

            if (!ownsJournal) {
                res.status(HTTP_STATUS_UNAUTHORIZED)
                    .json(`Unauthorized access to journal ${(req.params.id)}.`);
                return;
            }

            this.journalRepository.updateJournal$(req.params.id, req.body.name)
                .subscribe((journal) => {
                    res.status(HTTP_STATUS_OK)
                        .json(journal);
                });
        })).subscribe();
    }

     private userOwnsJournal$(user: User, journalId: string): Observable<boolean> {
        return this.journalRepository.journal$(journalId).pipe(
            map((journal: Journal | undefined): boolean => {
                if (!journal)
                    return false;

                return(journal.author.toString() === user._id.toString());
            })
        );
    }
}