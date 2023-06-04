import {Entry} from "./entry";
import {
    EntriesRepository,
    FilterArgs,
    PaginationArgs,
    QueryArgs,
    SortArgs
} from "./entries-repository";
import {ENTRIES_REPOSITORY} from "../repositories-config";
import {
    CreateEntryDTO,
    DeleteEntryDTO,
    GetEntriesDTO,
    GetEntryDTO,
    UpdateEntryDTO
} from "./entries-dtos";
import {ValidationResult} from "../utils/validation-result";
import {
    validateCreateEntryDTO,
    validateDeleteEntryDTO,
    validateGetEntriesDTO,
    validateGetEntryDTO,
    validateUpdateEntryDTO
} from "./entries-dto-validator";

const repository: EntriesRepository = ENTRIES_REPOSITORY;

const mapToGetEntriesQueryArgs = (dto: GetEntriesDTO): QueryArgs => {
    let queryArgs: QueryArgs = {}
    if (dto.idRegex)
        queryArgs.idRegex = dto.idRegex;
    if (dto.journal)
        queryArgs.journal = dto.journal;
    if (dto.journalRegex)
        queryArgs.journalRegex = dto.journalRegex;
    if (dto.body)
        queryArgs.body = dto.body;
    if (dto.bodyRegex)
        queryArgs.bodyRegex = dto.bodyRegex;
    return queryArgs;
};

const mapToGetEntriesSortArgs = (dto: GetEntriesDTO): SortArgs => {
    const sortArgs: SortArgs = {};
    if (dto.sort)
        sortArgs.sort = dto.sort
    dto.order ? sortArgs.order = dto.order : sortArgs.order = 1;
    return sortArgs;
};

const mapToGetEntriesFilterArgs = (dto: GetEntriesDTO): FilterArgs => {
    const filterArgs: FilterArgs = {};
    if (dto.startDate)
        filterArgs.startDate = dto.startDate;
    if (dto.endDate)
        filterArgs.endDate = dto.endDate;
    return filterArgs;
};

const mapToGetEntriesPaginationArgs = (dto: GetEntriesDTO): PaginationArgs => {
    const paginationArgs: PaginationArgs = {};
    dto.page ? paginationArgs.page = dto.page : paginationArgs.page = 1;
    dto.limit ? paginationArgs.limit = dto.limit : paginationArgs.limit = 32;
    return paginationArgs;
};

const mapToCreateEntryQueryArgs = (dto: CreateEntryDTO): QueryArgs =>
    ({journal: dto.journal, body: dto.body});

const mapToDeleteEntryQueryArgs = (dto: DeleteEntryDTO): QueryArgs =>
    ({id: dto.id});

const mapToUpdateEntryQueryArgs = (dto: UpdateEntryDTO): QueryArgs => {
    let args: QueryArgs = {id: dto.id};
    if (dto.journal)
        args.journal = dto.journal;
    if (dto.body)
        args.body = dto.body;
    return args;
};

const mapToGetEntryQueryArgs = (dto: GetEntryDTO): QueryArgs =>
    ({id: dto.id});

export const EntriesController = {
    getEntry: async (dto: GetEntryDTO): Promise<Entry> => {
        const validationResult: ValidationResult = await validateGetEntryDTO(dto);
        if (!validationResult.outcome)
            throw validationResult.error;
        const args = mapToGetEntryQueryArgs(dto);
        return repository.getEntry(args);
    },

    getEntries: async (dto: GetEntriesDTO): Promise<Entry[]> => {
        const validationResult: ValidationResult = await validateGetEntriesDTO(dto);
        if (!validationResult.outcome)
            throw validationResult.error;
        const queryArgs = mapToGetEntriesQueryArgs(dto);
        const sortArgs = mapToGetEntriesSortArgs(dto);
        const filterArgs = mapToGetEntriesFilterArgs(dto);
        const paginationArgs = mapToGetEntriesPaginationArgs(dto);
        return repository.getEntries(queryArgs, sortArgs, filterArgs, paginationArgs);
    },

    createEntry: async (dto: CreateEntryDTO): Promise<Entry> => {
        const validationResult: ValidationResult = await validateCreateEntryDTO(dto);
        if (!validationResult.outcome)
            throw validationResult.error;
        const args: QueryArgs = mapToCreateEntryQueryArgs(dto);
        return repository.createEntry(args);
    },

    deleteEntry: async (dto: DeleteEntryDTO): Promise<Entry> => {
        const validationResult: ValidationResult = await validateDeleteEntryDTO(dto);
        if (!validationResult.outcome)
            throw validationResult.error;
        const args: QueryArgs = mapToDeleteEntryQueryArgs(dto);
        return repository.deleteEntry(args);
    },

    updateEntry: async (dto: UpdateEntryDTO): Promise<Entry> => {
        const validationResult: ValidationResult = await validateUpdateEntryDTO(dto);
        if (!validationResult.outcome)
            throw validationResult.error;
        const args: QueryArgs = mapToUpdateEntryQueryArgs(dto);
        return repository.updateEntry(args);
    },
};
