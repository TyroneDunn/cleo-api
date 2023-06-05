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
import {User} from "../user/user";

export const validateGetEntryDTO = async (user: User, dto: GetEntryDTO): Promise<ValidationResult> => {
    if (!dto.id)
        return {outcome: false, error: new BadRequestError('Entry ID required.')};
    if (!(await ENTRIES_REPOSITORY.exists(dto.id)))
        return {outcome: false, error: new NotFoundError(`Entry ${dto.id} not found.`)};
    if (!(await ENTRIES_REPOSITORY.ownsEntry(user._id.toString(), dto.id)))
        return {outcome: false, error: new UnauthorizedError(`Unauthorized access to entry ${dto.id}`)};
    return {outcome: true};
};

export const validateGetEntriesDTO = async (user: User, dto: GetEntriesDTO): Promise<ValidationResult> => {
    if ((dto.body && dto.bodyRegex) ||
        (dto.body && dto.bodyRegex) ||
        (dto.journal && dto.journalRegex)) {
        return {outcome: false, error: new BadRequestError('Invalid query.')};
    }
    if (dto.journal) {
        if (!(await JOURNALS_REPOSITORY.exists(dto.journal)))
            return {outcome: false, error: new NotFoundError(`Journal ${dto.journal} not found.`)};
        if (!(await JOURNALS_REPOSITORY.ownsJournal(user._id.toString(), dto.journal)))
            return {outcome: false, error: new UnauthorizedError(`Unauthorized access to journal ${dto.journal}`)};
    }
    return {outcome: true};
};

export const validateCreateEntryDTO = async (user: User, dto: CreateEntryDTO): Promise<ValidationResult> => {
    if (!dto.journal)
        return {outcome: false, error: new BadRequestError('Journal required.')};
    if (!dto.body)
        return {outcome: false, error: new BadRequestError('Body required.')};
    if (!(await JOURNALS_REPOSITORY.exists(dto.journal)))
        return {outcome: false, error: new NotFoundError(`Journal ${dto.journal} not found.`)};
    if (!(await JOURNALS_REPOSITORY.ownsJournal(user._id.toString(),dto.journal)))
        return {outcome: false, error: new UnauthorizedError(`Unauthorized access to journal ${dto.journal}`)};
    return {outcome: true};
};

export const validateDeleteEntryDTO = async (user: User, dto: DeleteEntryDTO): Promise<ValidationResult> => {
    if (!dto.id)
        return {outcome: false, error: new BadRequestError('Entry ID required.')};
    if (!(await ENTRIES_REPOSITORY.exists(dto.id)))
        return {outcome: false, error: new NotFoundError(`Entry ${dto.id} not found.`)};
    if (!(await ENTRIES_REPOSITORY.ownsEntry(user._id.toString(), dto.id)))
        return {outcome: false, error: new UnauthorizedError(`Unauthorized access to entry ${dto.id}`)};
    return {outcome: true};
};

export const validateUpdateEntryDTO = async (user: User, dto: UpdateEntryDTO): Promise<ValidationResult> => {
    if (!dto.id)
        return {outcome: false, error: new BadRequestError('Entry ID required.')};
    if ((!dto.body) && (!dto.journal))
        return {outcome: false, error: new BadRequestError('Update field required.')};
    if (!(await ENTRIES_REPOSITORY.exists(dto.id)))
        return {outcome: false, error: new NotFoundError(`Entry ${dto.id} not found.`)};
    if (!(await ENTRIES_REPOSITORY.ownsEntry(user._id.toString(), dto.id)))
        return {outcome: false, error: new UnauthorizedError(`Unauthorized access to entry ${dto.id}`)};
    return {outcome: true};
};