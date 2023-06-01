import {
    CreateJournalDTO,
    DeleteJournalDTO,
    GetJournalDTO,
    GetJournalsDTO,
    UpdateJournalDTO
} from "./journal-dtos";

export type ValidationResult = {
    status: boolean,
    error?: Error,
};

export const validateGetJournalDTO = async (dto: GetJournalDTO): Promise<ValidationResult> => {
};
export const validateGetJournalsDTO = async (dto: GetJournalsDTO): Promise<ValidationResult> => {
};
export const validateCreateJournalDTO = async (dto: CreateJournalDTO): Promise<ValidationResult> => {
};
export const validateDeleteJournalDTO = async (dto: DeleteJournalDTO): Promise<ValidationResult> => {
};
export const validateUpdateJournalDTO = async (dto: UpdateJournalDTO): Promise<ValidationResult> => {
};
