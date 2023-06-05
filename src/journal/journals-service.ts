import {Journal} from "./journal";
import {JOURNALS_REPOSITORY} from "../repositories-config";
import {JournalsRepository} from "./journals-repository";
import {
    validateCreateJournalDTO,
    validateDeleteJournalDTO,
    validateGetJournalDTO,
    validateGetJournalsDTO,
    validateUpdateJournalDTO
} from "./journals-dtos-validator";
import {
    CreateJournalDTO,
    DeleteJournalDTO,
    GetJournalDTO,
    GetJournalsDTO,
    UpdateJournalDTO
} from "./journals-dtos";
import {ValidationResult} from "../utils/validation-result";
import {User} from "../user/user";

const repository: JournalsRepository = JOURNALS_REPOSITORY;

export const JournalsService = {
    getJournal: async (user: User, dto: GetJournalDTO): Promise<Journal> => {
        const validationResult: ValidationResult = await validateGetJournalDTO(user, dto);
        if (!validationResult.outcome)
            throw validationResult.error;
        return repository.getJournal(dto);
    },

    getJournals: async (user: User, dto: GetJournalsDTO): Promise<Journal[]> => {
        const validationResult: ValidationResult = await validateGetJournalsDTO(user, dto);
        if (!validationResult.outcome)
            throw validationResult.error;
        return repository.getJournals(dto);
    },
    
    createJournal: async (user: User, dto: CreateJournalDTO): Promise<Journal> => {
        const validationResult: ValidationResult = await validateCreateJournalDTO(user, dto);
        if (!validationResult.outcome)
            throw validationResult.error;
        return repository.createJournal(dto)
    },
    
    deleteJournal: async (user: User, dto: DeleteJournalDTO): Promise<Journal> => {
        const validationResult: ValidationResult = await validateDeleteJournalDTO(user, dto);
        if (!validationResult.outcome)
            throw validationResult.error;
        return repository.deleteJournal(dto);
    },
    
    updateJournal: async (user: User, dto: UpdateJournalDTO): Promise<Journal> => {
        const validationResult: ValidationResult = await validateUpdateJournalDTO(user, dto);
        if (!validationResult.outcome)
            throw validationResult.error;
        return repository.updateJournal(dto);
    },
};