import {Journal} from "./journal.type";
import {JOURNALS_REPOSITORY} from "../config";
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
    validateGetJournalsDTO, validateUpdateJournalDTO
} from "./journals-dto-validator";
import {
    CreateJournalDTO,
    DeleteJournalDTO,
    GetJournalDTO,
    GetJournalsDTO,
    UpdateJournalDTO
} from "./journals-dtos";
import {ValidationResult} from "../utils/validation-result";

const buildQueryArgs = (dto: GetJournalsDTO) => {
    let queryArgs: QueryArgs = {author: dto.userId}
    if (dto.idRegex)
        queryArgs.idRegex = dto.idRegex
    if (dto.author)
        queryArgs.author = dto.author
    if (dto.authorRegex)
        queryArgs.authorRegex = dto.authorRegex
    if (dto.name)
        queryArgs.name = dto.name
    if (dto.nameRegex)
        queryArgs.nameRegex = dto.nameRegex
    return queryArgs;
};

const buildSortArgs = (dto: GetJournalsDTO) => {
    const sortArgs: SortArgs = {};
    if (dto.sort)
        sortArgs.sort = dto.sort
    dto.order ? sortArgs.order = dto.order : sortArgs.order = 1;
    return sortArgs;
};

const buildFilterArgs = (dto: GetJournalsDTO) => {
    const filterArgs: FilterArgs = {};
    if (dto.startDate)
        filterArgs.startDate = dto.startDate;
    if (dto.endDate)
        filterArgs.endDate = dto.endDate;
    return filterArgs;
};

const buildPaginationArgs = (dto: GetJournalsDTO) => {
    const paginationArgs: PaginationArgs = {};
    dto.page ? paginationArgs.page = dto.page : paginationArgs.page = 1;
    dto.limit ? paginationArgs.limit = dto.limit : paginationArgs.limit = 32;
    return paginationArgs;
};

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
        const queryArgs = buildQueryArgs(dto);
        const sortArgs = buildSortArgs(dto);
        const filterArgs = buildFilterArgs(dto);
        const paginationArgs = buildPaginationArgs(dto);
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
