import {Journal} from "./journal";
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
    CreateJournalDTO,
    DeleteJournalDTO,
    DeleteJournalsDTO,
    GetJournalDTO,
    GetJournalsDTO,
    GetJournalsResponseDTO,
    UpdateJournalDTO
} from "./journals-dtos";
import {ValidationResult} from "../utils/validation-result";
import {User} from "../user/user";

const repository: JournalsRepository = JOURNALS_REPOSITORY;

export const getJournal = async (user: User, dto: GetJournalDTO): Promise<Journal> => {
    const validationResult: ValidationResult = await validateGetJournalDTO(user, dto);
    if (!validationResult.outcome)
        throw validationResult.error;
    return repository.getJournal(dto);
};

export const getJournals = async (user: User, dto: GetJournalsDTO): Promise<GetJournalsResponseDTO> => {
    const validationResult: ValidationResult = await validateGetJournalsDTO(user, dto);
    if (!validationResult.outcome)
        throw validationResult.error;
    return repository.getJournals(dto);
};

export const createJournal = async (user: User, dto: CreateJournalDTO): Promise<Journal> => {
    const validationResult: ValidationResult = await validateCreateJournalDTO(user, dto);
    if (!validationResult.outcome)
        throw validationResult.error;
    return repository.createJournal(dto)
};

export const updateJournal = async (user: User, dto: UpdateJournalDTO): Promise<Journal> => {
    const validationResult: ValidationResult = await validateUpdateJournalDTO(user, dto);
    if (!validationResult.outcome)
        throw validationResult.error;
    return repository.updateJournal(dto);
};

export const deleteJournal = async (user: User, dto: DeleteJournalDTO): Promise<Journal> => {
    const validationResult: ValidationResult = await validateDeleteJournalDTO(user, dto);
    if (!validationResult.outcome)
        throw validationResult.error;
    return repository.deleteJournal(dto);
};

export const deleteJournals = async (user: User, dto: DeleteJournalsDTO): Promise<string> => {
    const validationResult: ValidationResult = await validateDeleteJournalsDTO(user, dto);
    if (!validationResult.outcome)
        throw validationResult.error;
    return repository.deleteJournals(dto);
};