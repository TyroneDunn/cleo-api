import {Entry} from "./entry.type";
import {
    EntriesRepository,
    FilterArgs,
    PaginationArgs,
    QueryArgs,
    SortArgs
} from "./entries-repository";
import {ENTRIES_REPOSITORY} from "../config";
import {
    CreateEntryDTO,
    DeleteEntryDTO,
    GetEntriesDTO,
    GetEntryDTO,
    UpdateEntryDTO
} from "./entry-dtos";
import {ValidationResult} from "../utils/validation-result";
const repository: EntriesRepository = ENTRIES_REPOSITORY;

const buildQueryArgs = (dto: GetEntriesDTO): QueryArgs => {
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

const buildSortArgs = (dto: GetEntriesDTO): SortArgs => {
    const sortArgs: SortArgs = {};
    if (dto.sort)
        sortArgs.sort = dto.sort
    dto.order ? sortArgs.order = dto.order : sortArgs.order = 1;
    return sortArgs;
};

const buildFilterArgs = (dto: GetEntriesDTO): FilterArgs => {
    const filterArgs: FilterArgs = {};
    if (dto.startDate)
        filterArgs.startDate = dto.startDate;
    if (dto.endDate)
        filterArgs.endDate = dto.endDate;
    return filterArgs;
};

const buildPaginationArgs = (dto: GetEntriesDTO): PaginationArgs => {
    const paginationArgs: PaginationArgs = {};
    dto.page ? paginationArgs.page = dto.page : paginationArgs.page = 1;
    dto.limit ? paginationArgs.limit = dto.limit : paginationArgs.limit = 32;
    return paginationArgs;
};

export const EntriesController = {
    getEntry: async (dto: GetEntryDTO): Promise<Entry> => {
        const validationResult: ValidationResult = await validateGetEntryDTO(dto);
        if (!validationResult.status)
            throw validationResult.error;

        const args: QueryArgs = {id: dto.id};
        return repository.getEntry(args);
    },

    getEntries: async (dto: GetEntriesDTO): Promise<Entry[]> => {
        const validationResult: ValidationResult = await validateGetEntriesDTO(dto);
        if (!validationResult.status)
            throw validationResult.error;
        const queryArgs = buildQueryArgs(dto);
        const sortArgs = buildSortArgs(dto);
        const filterArgs = buildFilterArgs(dto);
        const paginationArgs = buildPaginationArgs(dto);
        return repository.getEntries(queryArgs, sortArgs, filterArgs, paginationArgs);
    },

    createEntry: async (dto: CreateEntryDTO): Promise<Entry> => {
        const validationResult: ValidationResult = await validateCreateEntryDTO(dto);
        if (!validationResult.status)
            throw validationResult.error;

        const args: QueryArgs = {journal: dto.journal, body: dto.body};
        return repository.createEntry(args);
    },

    deleteEntry: async (dto: DeleteEntryDTO): Promise<Entry> => {
        const validationResult: ValidationResult = await validateDeleteEntryDTO(dto);
        if (!validationResult.status)
            throw validationResult.error;

        const args: QueryArgs = {id: dto.id};
        return repository.deleteEntry(args);
    },

    updateEntry: async (dto: UpdateEntryDTO): Promise<Entry> => {
        const validationResult: ValidationResult = await validateUpdateEntryDTO(dto);
        if (!validationResult.status)
            throw validationResult.error;

        let args: QueryArgs = {id: dto.id};
        if (dto.journal)
            args.journal = dto.journal;
        if (dto.body)
            args.body = dto.body;

        return repository.updateEntry(args);
    },
};
