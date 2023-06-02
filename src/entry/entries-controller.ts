import {Entry} from "./entry.type";
import {EntriesRepository, QueryArgs} from "./entries-repository";
import {ENTRIES_REPOSITORY} from "../config";
import {
    CreateEntryDTO,
    DeleteEntryDTO,
    GetEntriesDTO,
    GetEntryDTO,
    UpdateEntryDTO
} from "./entry-dtos";
import {ValidationResult} from "../utils/validation-result";
import {validateGetJournalsDTO} from "../journal/journal-dto-validator";
const repository: EntriesRepository = ENTRIES_REPOSITORY;

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
