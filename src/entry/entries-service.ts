import {Entry} from "./entry";
import {EntriesRepository} from "./entries-repository";
import {ENTRIES_REPOSITORY} from "../repositories-config";
import {
    CreateEntryDTO,
    DeleteEntryDTO,
    GetEntriesDTO,
    GetEntryDTO,
    UpdateEntryDTO
} from "./entries-dtos";
import {
    validateCreateEntryDTO,
    validateDeleteEntryDTO,
    validateGetEntriesDTO,
    validateGetEntryDTO,
    validateUpdateEntryDTO
} from "./entries-dtos-validator";
import {ValidationResult} from "../utils/validation-result";
import {User} from "../user/user";

const repository: EntriesRepository = ENTRIES_REPOSITORY;

export const getEntry = async (user: User, dto: GetEntryDTO): Promise<Entry> => {
    const validationResult: ValidationResult = await validateGetEntryDTO(user, dto);
    if (!validationResult.outcome)
        throw validationResult.error;
    return repository.getEntry(dto);
};

export const getEntries = async (user: User, dto: GetEntriesDTO): Promise<Entry[]> => {
    const validationResult: ValidationResult = await validateGetEntriesDTO(user, dto);
    if (!validationResult.outcome)
        throw validationResult.error;
    return repository.getEntries(dto);
};

export const createEntry = async (user: User, dto: CreateEntryDTO): Promise<Entry> => {
    const validationResult: ValidationResult = await validateCreateEntryDTO(user, dto);
    if (!validationResult.outcome)
        throw validationResult.error;
    return repository.createEntry(dto);
};

export const deleteEntry = async (user: User, dto: DeleteEntryDTO): Promise<Entry> => {
    const validationResult: ValidationResult = await validateDeleteEntryDTO(user, dto);
    if (!validationResult.outcome)
        throw validationResult.error;
    return repository.deleteEntry(dto);
};

export const updateEntry = async (user: User, dto: UpdateEntryDTO): Promise<Entry> => {
    const validationResult: ValidationResult = await validateUpdateEntryDTO(user, dto);
    if (!validationResult.outcome)
        throw validationResult.error;
    return repository.updateEntry(dto);
};