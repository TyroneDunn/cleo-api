import {
    CreateEntryRequest,
    DeleteEntriesRequest,
    DeleteEntryRequest,
    Entry, GetEntriesRequest, GetEntryRequest,
    UpdateEntryRequest,
} from "./entries.types";
import {EntriesRepository} from "./entries-repository.type";
import {ENTRIES_REPOSITORY} from "../repositories-config";
import {
    validateGetEntryDTO,
    validateGetEntriesDTO,
    validateCreateEntryDTO,
    validateUpdateEntryDTO,
    validateDeleteEntryDTO,
    validateDeleteEntriesDTO,
} from "./entries-dtos-validator";
import {ValidationResult} from "../utils/validation-result";
import {User} from "../user/user";
import {PaginatedResponse} from "../utils/paginated-response";

const repository: EntriesRepository = ENTRIES_REPOSITORY;

export const getEntry = async (user: User, dto: GetEntryRequest): Promise<Entry> => {
    const validationResult: ValidationResult = await validateGetEntryDTO(user, dto);
    if (validationResult.error) throw validationResult.error;
    return repository.getEntry(dto);
};

export const getEntries = async (user: User, dto: GetEntriesRequest): Promise<PaginatedResponse<Entry>> => {
    const validationResult: ValidationResult = await validateGetEntriesDTO(user, dto);
    if (validationResult.error) throw validationResult.error;
    return repository.getEntries(dto);
};

export const createEntry = async (user: User, dto: CreateEntryRequest): Promise<Entry> => {
    const validationResult: ValidationResult = await validateCreateEntryDTO(user, dto);
    if (validationResult.error) throw validationResult.error;
    return repository.createEntry(dto);
};

export const updateEntry = async (user: User, dto: UpdateEntryRequest): Promise<Entry> => {
    const validationResult: ValidationResult = await validateUpdateEntryDTO(user, dto);
    if (validationResult.error) throw validationResult.error;
    return repository.updateEntry(dto);
};

export const deleteEntry = async (user: User, dto: DeleteEntryRequest): Promise<Entry> => {
    const validationResult: ValidationResult = await validateDeleteEntryDTO(user, dto);
    if (validationResult.error) throw validationResult.error;
    return repository.deleteEntry(dto);
};

export const deleteEntries = async (user: User, dto: DeleteEntriesRequest): Promise<string> => {
    const validationResult: ValidationResult = await validateDeleteEntriesDTO(user, dto);
    if (validationResult.error) throw validationResult.error;
    return repository.deleteEntries(dto);
};
