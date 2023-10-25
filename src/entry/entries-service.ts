import {Entry} from "./entry";
import {EntriesRepository} from "./entries-repository";
import {ENTRIES_REPOSITORY} from "../repositories-config";
import {
    GetEntryDTO,
    GetEntriesDTO,
    GetEntriesResponseDTO,
    CreateEntryDTO,
    UpdateEntryDTO,
    DeleteEntryDTO,
    DeleteEntriesDTO,
} from "./entries-dtos";
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

const repository: EntriesRepository = ENTRIES_REPOSITORY;

export const getEntry = async (user: User, dto: GetEntryDTO): Promise<Entry> => {
    const validationResult: ValidationResult = await validateGetEntryDTO(user, dto);
    if (!validationResult.outcome)
        throw validationResult.error;
    return repository.getEntry(dto);
};

export const getEntries = async (user: User, dto: GetEntriesDTO): Promise<GetEntriesResponseDTO> => {
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

export const updateEntry = async (user: User, dto: UpdateEntryDTO): Promise<Entry> => {
    const validationResult: ValidationResult = await validateUpdateEntryDTO(user, dto);
    if (!validationResult.outcome)
        throw validationResult.error;
    return repository.updateEntry(dto);
};

export const deleteEntry = async (user: User, dto: DeleteEntryDTO): Promise<Entry> => {
    const validationResult: ValidationResult = await validateDeleteEntryDTO(user, dto);
    if (!validationResult.outcome)
        throw validationResult.error;
    return repository.deleteEntry(dto);
};

export const deleteEntries = async (user: User, dto: DeleteEntriesDTO): Promise<string> => {
    const validationResult: ValidationResult = await validateDeleteEntriesDTO(user, dto);
    if (!validationResult.outcome)
        throw validationResult.error;
    return repository.deleteEntries(dto);
};
