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
            res.status(HTTP_STATUS_BAD_REQUEST).json(`ID required.`);
            return;
        }

        const journalExists = await this.journalRepository.journalExists(id);
        if (!journalExists) {
            res.status(HTTP_STATUS_NOT_FOUND).json(`Journal ${id} not found.`);
            return;
        }
        
        this.journalRepository.journal$(id).subscribe((journal: Journal) => {
            if (!journal) {
                res.status(HTTP_STATUS_NOT_FOUND).json(`Journal ${id} not found.`);
                return;
            }

            res.json(journal);
        });
    }

    private journals$: RequestHandler = async (req, res) => {
        this.journalRepository.journals$((req.user as User).id)
            .subscribe((journals: Journal[]) => {
                res.json(journals);
            });
    };

    private createJournal$: RequestHandler = async (req, res) => {
        const user = req.user as User;
        const journalName = req.body.name as string;

        if (!journalName){
            res.status(HTTP_STATUS_BAD_REQUEST).json('Journal name required.');
            return;
        }

        this.journalRepository.createJournal$(user.id, journalName)
            .subscribe((journal: Journal) => {
                res.status(HTTP_STATUS_CREATED).json(journal);
            });
    };

    private deleteJournal$: RequestHandler = async (req, res) => {
        const user = req.user as User;
        const journalId = req.params.id;
        const journalExists = await this.journalRepository.journalExists(journalId);
        const hasOwnershipOfJournal = await this.assertJournalOwnership(user, journalId);

        if (!journalId) {
            res.status(HTTP_STATUS_BAD_REQUEST).json(`Journal id required.`);
            return;
        }

        if (!journalExists) {
            res.status(HTTP_STATUS_NOT_FOUND).json(`Journal ${journalId} not found.`);
            return;
        }

        if (!hasOwnershipOfJournal) {
            res.status(HTTP_STATUS_UNAUTHORIZED).json(`Cannot access journal ${journalId}.`);
            return;
        }

        this.journalRepository.deleteJournal$(journalId).subscribe((success) => {
            if (!success) {
                res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json(`Journal ${journalId} deleted.`);
                return;
            }
            res.status(HTTP_STATUS_OK).json(`Journal ${journalId} deleted.`);
        });
    };

    private updateJournal$: RequestHandler = async (req, res) => {
        const user = req.user as User;
        const journalId = req.params.id;
        const journalName = req.body.name;
        const journalExists = this.journalRepository.journalExists(journalId);
        const hasOwnershipOfJournal = await this.assertJournalOwnership(user, journalId);

        if (!journalId) {
            res.status(HTTP_STATUS_BAD_REQUEST).json(`Journal id required.`);
            return;
        }

        if (!journalExists) {
            res.status(HTTP_STATUS_NOT_FOUND).json(`Journal ${journalId} not found.`);
            return;
        }

        if (!hasOwnershipOfJournal) {
            res.status(HTTP_STATUS_UNAUTHORIZED).json(`Cannot access journal ${journalId}.`);
            return;
        }

        const journal = await this.journalRepository.updateJournal(journalId, journalName)
        res.status(HTTP_STATUS_OK).json(journal);
    }

     private async assertJournalOwnership(user: User, journalId: string): Promise<boolean> {
        if (!journalId)
            return false;

        if (!await this.journalRepository.journalExists(journalId))
            return false;

        const journal = await this.journalRepository.getJournal(journalId);
        return (journal.author.toString() === user.id);
    }
}