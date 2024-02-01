import {Journal} from "./journals.types";
import {JOURNALS_REPOSITORY} from "../repositories-config";
import {JournalsRepository} from "./journals-repository";
import {
    validateCreateJournalDTO,
    validateDeleteJournalDTO,
    validateDeleteJournalsDTO,
    validateGetJournalDTO,
    validateGetJournalsDTO,
    validateUpdateJournalDTO
} from "./journals-dtos-validator";
import {
    CreateJournalRequest,
    DeleteJournalRequest,
    DeleteJournalsRequest,
    GetJournalRequest,
    GetJournalsRequest,
    UpdateJournalRequest
} from "./journals-dtos";
import {ValidationResult} from "../utils/validation-result";
import {User} from "../user/user";
import {PaginatedResponse} from "../utils/paginated-response";

const repository: JournalsRepository = JOURNALS_REPOSITORY;

export const getJournal = async (user: User, dto: GetJournalRequest): Promise<Journal> => {
    const validationResult: ValidationResult = await validateGetJournalDTO(user, dto);
    if (validationResult.error) throw validationResult.error;
    return repository.getJournal(dto);
};

export const getJournals = async (user: User, dto: GetJournalsRequest): Promise<PaginatedResponse<Journal>> => {
    const validationResult: ValidationResult = await validateGetJournalsDTO(user, dto);
    if (validationResult.error) throw validationResult.error;
    return repository.getJournals(dto);
};

export const createJournal = async (user: User, dto: CreateJournalRequest): Promise<Journal> => {
    const validationResult: ValidationResult = await validateCreateJournalDTO(user, dto);
    if (validationResult.error) throw validationResult.error;
    return repository.createJournal(dto)
};

export const updateJournal = async (user: User, dto: UpdateJournalRequest): Promise<Journal> => {
    const validationResult: ValidationResult = await validateUpdateJournalDTO(user, dto);
    if (validationResult.error) throw validationResult.error;
    return repository.updateJournal(dto);
};

export const deleteJournal = async (user: User, dto: DeleteJournalRequest): Promise<Journal> => {
    const validationResult: ValidationResult = await validateDeleteJournalDTO(user, dto);
    if (validationResult.error) throw validationResult.error;
    return repository.deleteJournal(dto);
};

export const deleteJournals = async (user: User, dto: DeleteJournalsRequest): Promise<string> => {
    const validationResult: ValidationResult = await validateDeleteJournalsDTO(user, dto);
    if (validationResult.error) throw validationResult.error;
    return repository.deleteJournals(dto);
};