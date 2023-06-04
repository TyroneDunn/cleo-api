import {
    CreateJournalDTO,
    DeleteJournalDTO,
    GetJournalDTO,
    GetJournalsDTO,
    UpdateJournalDTO
} from "./journals-dtos";
import {BadRequestError, NotFoundError, UnauthorizedError} from "../utils/errors";
import {JOURNALS_REPOSITORY} from "../repositories-config"
import {ValidationResult} from "../utils/validation-result";

export const validateGetJournalDTO = async (dto: GetJournalDTO): Promise<ValidationResult> => {
    if (!dto.userId)
        return {outcome: false, error: new BadRequestError('User ID required.')};
    if (!dto.id)
        return {outcome: false, error: new BadRequestError('Journal ID required.')};
    if (!(await JOURNALS_REPOSITORY.exists({id: dto.id})))
        return {outcome: false, error: new NotFoundError(`Journal ${dto.id} not found.`)};
    if (!(await JOURNALS_REPOSITORY.ownsJournal({author: dto.userId, id: dto.id})))
        return {outcome: false, error: new UnauthorizedError(`Unauthorized access to journal ${dto.id}`)};
    return {outcome: true};
};

export const validateGetJournalsDTO = async (dto: GetJournalsDTO): Promise<ValidationResult> => {
    if ((dto.name && dto.nameRegex) ||
        (dto.author && dto.authorRegex)) {
        return {outcome: false, error: new BadRequestError('Invalid query.')};
    }
    return {outcome: true};
};

export const validateCreateJournalDTO = async (dto: CreateJournalDTO): Promise<ValidationResult> => {
    if (!dto.userId)
        return {outcome: false, error: new BadRequestError('User ID required.')};
    if (!dto.name)
        return {outcome: false, error: new BadRequestError('Journal name required.')};
    return {outcome: true};
};

export const validateDeleteJournalDTO = async (dto: DeleteJournalDTO): Promise<ValidationResult> => {
    if (!dto.userId)
        return {outcome: false, error: new BadRequestError('User ID required.')};
    if (!dto.id)
        return {outcome: false, error: new BadRequestError('Journal ID required.')};
    if (!(await JOURNALS_REPOSITORY.exists({id: dto.id})))
        return {outcome: false, error: new NotFoundError(`Journal ${dto.id} not found.`)};
    if (!(await JOURNALS_REPOSITORY.ownsJournal({author: dto.userId, id: dto.id})))
        return {outcome: false, error: new UnauthorizedError(`Unauthorized access to journal ${dto.id}`)};
    return {outcome: true};
};

export const validateUpdateJournalDTO = async (dto: UpdateJournalDTO): Promise<ValidationResult> => {
    if (!dto.userId)
        return {outcome: false, error: new BadRequestError('User ID required.')};
    if (!dto.id)
        return {outcome: false, error: new BadRequestError('Journal ID required.')};
    if (!dto.name)
        return {outcome: false, error: new BadRequestError('Journal name required.')};
    if (!(await JOURNALS_REPOSITORY.exists({id: dto.id})))
        return {outcome: false, error: new NotFoundError(`Journal ${dto.id} not found.`)};
    if (!(await JOURNALS_REPOSITORY.ownsJournal({author: dto.userId, id: dto.id})))
        return {outcome: false, error: new UnauthorizedError(`Unauthorized access to journal ${dto.id}`)};
    return {outcome: true};
};
