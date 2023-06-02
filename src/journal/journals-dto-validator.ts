import {
    CreateJournalDTO,
    DeleteJournalDTO,
    GetJournalDTO,
    GetJournalsDTO,
    UpdateJournalDTO
} from "./journals-dtos";
import {BadRequestError, NotFoundError, UnauthorizedError} from "../utils/errors";
import {JOURNALS_REPOSITORY} from "../config"
import {ValidationResult} from "../utils/validation-result";

export const validateGetJournalDTO = async (dto: GetJournalDTO): Promise<ValidationResult> => {
    if (!dto.userId)
        return {status: false, error: new BadRequestError('User ID required.')};
    if (!dto.id)
        return {status: false, error: new BadRequestError('Journal ID required.')};
    if (!(await JOURNALS_REPOSITORY.exists({id: dto.id})))
        return {status: false, error: new NotFoundError(`Journal ${dto.id} not found.`)};
    if (!(await JOURNALS_REPOSITORY.ownsJournal({author: dto.userId, id: dto.id})))
        return {status: false, error: new UnauthorizedError(`Unauthorized access to journal ${dto.id}`)};
    return {status: true};
};

export const validateGetJournalsDTO = async (dto: GetJournalsDTO): Promise<ValidationResult> => {
    if ((dto.name && dto.nameRegex) ||
        (dto.author && dto.authorRegex)) {
        return {status: false, error: new BadRequestError('Invalid query.')};
    }
    return {status: true};
};

export const validateCreateJournalDTO = async (dto: CreateJournalDTO): Promise<ValidationResult> => {
    if (!dto.userId)
        return {status: false, error: new BadRequestError('User ID required.')};
    if (!dto.name)
        return {status: false, error: new BadRequestError('Journal name required.')};
    return {status: true};
};

export const validateDeleteJournalDTO = async (dto: DeleteJournalDTO): Promise<ValidationResult> => {
    if (!dto.userId)
        return {status: false, error: new BadRequestError('User ID required.')};
    if (!dto.id)
        return {status: false, error: new BadRequestError('Journal ID required.')};
    if (!(await JOURNALS_REPOSITORY.exists({id: dto.id})))
        return {status: false, error: new NotFoundError(`Journal ${dto.id} not found.`)};
    if (!(await JOURNALS_REPOSITORY.ownsJournal({author: dto.userId, id: dto.id})))
        return {status: false, error: new UnauthorizedError(`Unauthorized access to journal ${dto.id}`)};
    return {status: true};
};

export const validateUpdateJournalDTO = async (dto: UpdateJournalDTO): Promise<ValidationResult> => {
    if (!dto.userId)
        return {status: false, error: new BadRequestError('User ID required.')};
    if (!dto.id)
        return {status: false, error: new BadRequestError('Journal ID required.')};
    if (!dto.name)
        return {status: false, error: new BadRequestError('Journal name required.')};
    if (!(await JOURNALS_REPOSITORY.exists({id: dto.id})))
        return {status: false, error: new NotFoundError(`Journal ${dto.id} not found.`)};
    if (!(await JOURNALS_REPOSITORY.ownsJournal({author: dto.userId, id: dto.id})))
        return {status: false, error: new UnauthorizedError(`Unauthorized access to journal ${dto.id}`)};
    return {status: true};
};
