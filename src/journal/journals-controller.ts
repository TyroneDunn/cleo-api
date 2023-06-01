import {Journal} from "./journal.type";
import {JOURNALS_REPOSITORY} from "../utils/config";
import {
    FilterArgs,
    JournalsRepository,
    PaginationArgs,
    QueryArgs,
    SortArgs
} from "./journals-repository";
const repository: JournalsRepository = JOURNALS_REPOSITORY;
import {
    validateCreateJournalDTO, validateDeleteJournalDTO,
    validateGetJournalDTO,
    validateGetJournalsDTO, validateUpdateJournalDTO,
    ValidationResult
} from "./journal-dto-validator";
import {
    CreateJournalDTO,
    DeleteJournalDTO,
    GetJournalDTO,
    GetJournalsDTO,
    UpdateJournalDTO
} from "./journal-dtos";

export const JournalsController = {
    getJournal: async (dto: GetJournalDTO): Promise<Journal> => {
        const validationResult: ValidationResult = await validateGetJournalDTO(dto);
        if (!validationResult.status)
            throw validationResult.error;

        const args: QueryArgs = {id: dto.id};
        return repository.getJournal(args);
    },

    getJournals: async (dto: GetJournalsDTO): Promise<Journal[]> => {
        const validationResult: ValidationResult = await validateGetJournalsDTO(dto);
        if (!validationResult.status)
            throw validationResult.error;

        const queryArgs: QueryArgs = {
            id: dto.id,
            name: dto.name,
            author: dto.author,
            idRegex: dto.idRegex,
            nameRegex: dto.nameRegex,
            authorRegex: dto.authorRegex,
        }
        const sortArgs: SortArgs = {sort: dto.sort, order: dto.order};
        const filterArgs: FilterArgs = {startDate: dto.startDate, endDate: dto.endDate};
        const paginationArgs: PaginationArgs = {page: dto.page, limit: dto.limit};
        return repository.getJournals(queryArgs, sortArgs, filterArgs, paginationArgs);
    },
    
    createJournal: async (dto: CreateJournalDTO): Promise<Journal> => {
        const validationResult: ValidationResult = await validateCreateJournalDTO(dto);
        if (!validationResult.status)
            throw validationResult.error;
        const args: QueryArgs = {author: dto.userId, name: dto.name};
        return repository.createJournal(args)
    },
    
    deleteJournal: async (dto: DeleteJournalDTO): Promise<Journal> => {
        const validationResult: ValidationResult = await validateDeleteJournalDTO(dto);
        if (!validationResult.status)
            throw validationResult.error;
        const args: QueryArgs = {id: dto.id};
        return repository.deleteJournal(args);
    },
    
    updateJournal: async (dto: UpdateJournalDTO): Promise<Journal> => {
        const validationResult: ValidationResult = await validateUpdateJournalDTO(dto);
        if (!validationResult.status)
            throw validationResult.error;
        const args: QueryArgs = {id: dto.id, name: dto.name};
        return repository.updateJournal(args);
    },
};
