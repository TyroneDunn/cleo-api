import {
    CreateEntryDTO,
    DeleteEntryDTO,
    GetEntriesDTO,
    GetEntryDTO,
    UpdateEntryDTO
} from "./entries-dtos";
import {ValidationResult} from "../utils/validation-result";
import {BadRequestError, NotFoundError, UnauthorizedError} from "../utils/errors";
import {ENTRIES_REPOSITORY, JOURNALS_REPOSITORY} from "../repositories-config";

export const validateGetEntryDTO = async (dto: GetEntryDTO): Promise<ValidationResult> => {
    if (!dto.userId)
        return {status: false, error: new BadRequestError('User ID required.')};
    if (!dto.id)
        return {status: false, error: new BadRequestError('Entry ID required.')};
    if (!(await ENTRIES_REPOSITORY.exists({id: dto.id})))
        return {status: false, error: new NotFoundError(`Entry ${dto.id} not found.`)};
    if (!(await ENTRIES_REPOSITORY.ownsEntry({userId: dto.userId, id: dto.id})))
        return {status: false, error: new UnauthorizedError(`Unauthorized access to entry ${dto.id}`)};
    return {status: true};
};

export const validateGetEntriesDTO = async (dto: GetEntriesDTO): Promise<ValidationResult> => {
    if (!dto.userId)
        return {status: false, error: new BadRequestError('User ID required.')};
    if ((dto.body && dto.bodyRegex) ||
        (dto.body && dto.bodyRegex) ||
        (dto.journal && dto.journalRegex)) {
        return {status: false, error: new BadRequestError('Invalid query.')};
    }
    if (dto.journal) {
        if (!(await JOURNALS_REPOSITORY.exists({id: dto.journal})))
            return {status: false, error: new NotFoundError(`Journal ${dto.journal} not found.`)};
        if (!(await JOURNALS_REPOSITORY.ownsJournal({author: dto.userId, id: dto.journal})))
            return {status: false, error: new UnauthorizedError(`Unauthorized access to journal ${dto.journal}`)};
    }
    return {status: true};
};

export const validateCreateEntryDTO = async (dto: CreateEntryDTO): Promise<ValidationResult> => {
    if (!dto.userId)
        return {status: false, error: new BadRequestError('User ID required.')};
    if (!dto.journal)
        return {status: false, error: new BadRequestError('Journal required.')};
    if (!dto.body)
        return {status: false, error: new BadRequestError('Body required.')};
    if (!(await JOURNALS_REPOSITORY.exists({id: dto.journal})))
        return {status: false, error: new NotFoundError(`Journal ${dto.journal} not found.`)};
    if (!(await JOURNALS_REPOSITORY.ownsJournal({author: dto.userId, id: dto.journal})))
        return {status: false, error: new UnauthorizedError(`Unauthorized access to journal ${dto.journal}`)};
    return {status: true};
};

export const validateDeleteEntryDTO = async (dto: DeleteEntryDTO): Promise<ValidationResult> => {
    if (!dto.userId)
        return {status: false, error: new BadRequestError('User ID required.')};
    if (!dto.id)
        return {status: false, error: new BadRequestError('Entry ID required.')};
    if (!(await ENTRIES_REPOSITORY.exists({id: dto.id})))
        return {status: false, error: new NotFoundError(`Entry ${dto.id} not found.`)};
    if (!(await ENTRIES_REPOSITORY.ownsEntry({userId: dto.userId, id: dto.id})))
        return {status: false, error: new UnauthorizedError(`Unauthorized access to entry ${dto.id}`)};
    return {status: true};
};

export const validateUpdateEntryDTO = async (dto: UpdateEntryDTO): Promise<ValidationResult> => {
    if (!dto.userId)
        return {status: false, error: new BadRequestError('User ID required.')};
    if (!dto.id)
        return {status: false, error: new BadRequestError('Entry ID required.')};
    if ((!dto.body) && (!dto.journal))
        return {status: false, error: new BadRequestError('Update field required.')};
    if (!(await ENTRIES_REPOSITORY.exists({id: dto.id})))
        return {status: false, error: new NotFoundError(`Entry ${dto.id} not found.`)};
    if (!(await ENTRIES_REPOSITORY.ownsEntry({userId: dto.userId, id: dto.id})))
        return {status: false, error: new UnauthorizedError(`Unauthorized access to entry ${dto.id}`)};
    return {status: true};
};
