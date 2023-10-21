import {
    CreateJournalDTO,
    DeleteJournalDTO,
    GetJournalDTO,
    GetJournalsDTO,
    UpdateJournalDTO
} from "./journals-dtos";
import {
    BadRequestError,
    ForbiddenError,
    NotFoundError,
    UnauthorizedError
} from "../utils/errors";
import {JOURNALS_REPOSITORY} from "../repositories-config"
import {USERS_REPOSITORY} from "../repositories-config";
import {ValidationResult} from "../utils/validation-result";
import {User} from "../user/user";

export const validateGetJournalDTO = async (user: User, dto: GetJournalDTO): Promise<ValidationResult> => {
    if (!(user))
        return {outcome: false, error: new UnauthorizedError('Unauthorized.')};
    if (!dto.id)
        return {outcome: false, error: new BadRequestError('Journal ID required.')};
    if (!(await JOURNALS_REPOSITORY.ownsJournal(user.username, dto.id)) && !(await USERS_REPOSITORY.isAdmin(user.username)))
        return {outcome: false, error: new ForbiddenError('Insufficient permissions.')};
    if (!(await JOURNALS_REPOSITORY.exists(dto.id)))
        return {outcome: false, error: new NotFoundError(`Journal ${dto.id} not found.`)};
    return {outcome: true};
};

export const validateGetJournalsDTO = async (user: User, dto: GetJournalsDTO): Promise<ValidationResult> => {
    if (!(user))
        return {outcome: false, error: new UnauthorizedError('Unauthorized.')};
    if (!(await USERS_REPOSITORY.isAdmin(user.username)) && (user.username !== dto.author))
        return {outcome: false, error: new ForbiddenError('Insufficient permissions.')};
    if (dto.name && dto.nameRegex)
        return {outcome: false, error: new BadRequestError('Invalid query.')};
    if (dto.author && dto.authorRegex)
        return {outcome: false, error: new BadRequestError('Invalid query.')};
    if (dto.startDate) {
        if (isNaN(Date.parse(dto.startDate)))
            return {outcome: false, error: new BadRequestError('Invalid start date query. Provide a ISO date string.')};
    }
    if (dto.endDate) {
        if (isNaN(Date.parse(dto.endDate)))
            return {outcome: false, error: new BadRequestError('Invalid end date query. Provide a ISO date string.')};
    }
    if (dto.sort) {
        if (dto.sort !== 'id' && dto.sort !== 'name' && dto.sort !== 'lastUpdated' && dto.sort !== 'dateCreated')
            return {outcome: false, error: new BadRequestError('Invalid query. Sort option must' +
                    ' be id, name, lastUpdated, or dateCreated.')};
    }
    if (dto.order !== undefined) {
        if ((dto.order !== 1 && dto.order !== -1))
            return {outcome: false, error: new BadRequestError('Invalid query. Order must be' +
                    ' 1 or -1.')};
    }
    if (dto.page !== undefined) {
        if (dto.page < 1)
            return {outcome: false, error: new BadRequestError('Invalid query. Page must be' +
                    ' 1 or greater.')};
    }
    if (dto.limit !== undefined) {
        if (dto.limit < 0)
            return {outcome: false, error: new BadRequestError('Invalid query. Limit must be' +
                    ' 0 or greater.')};
    }
    return {outcome: true};
};

export const validateCreateJournalDTO = async (user: User, dto: CreateJournalDTO): Promise<ValidationResult> => {
    if (!(user))
        return {outcome: false, error: new UnauthorizedError('Unauthorized.')};
    if (!dto.name)
        return {outcome: false, error: new BadRequestError('Journal name required.')};
    if (!dto.author)
        return {outcome: false, error: new BadRequestError('Journal author required.')};
    return {outcome: true};
};

export const validateUpdateJournalDTO = async (user: User, dto: UpdateJournalDTO): Promise<ValidationResult> => {
    if (!(user))
        return {outcome: false, error: new UnauthorizedError('Unauthorized.')};
    if (!dto.id)
        return {outcome: false, error: new BadRequestError('Journal ID required.')};
    if (!dto.name)
        return {outcome: false, error: new BadRequestError('Journal name required.')};
    if (!(await JOURNALS_REPOSITORY.ownsJournal(user.username, dto.id)) && !(await USERS_REPOSITORY.isAdmin(user.username)))
        return {outcome: false, error: new ForbiddenError('Insufficient permissions.')};
    if (!(await JOURNALS_REPOSITORY.exists(dto.id)))
        return {outcome: false, error: new NotFoundError(`Journal ${dto.id} not found.`)};
    return {outcome: true};
};

export const validateDeleteJournalDTO = async (user: User, dto: DeleteJournalDTO): Promise<ValidationResult> => {
    if (!dto.id)
        return {outcome: false, error: new BadRequestError('Journal ID required.')};
    if (!(await JOURNALS_REPOSITORY.ownsJournal(user.username, dto.id)) && !(await USERS_REPOSITORY.isAdmin(user.username)))
        return {outcome: false, error: new ForbiddenError('Insufficient permissions.')};
    if (!(await JOURNALS_REPOSITORY.exists(dto.id)))
        return {outcome: false, error: new NotFoundError(`Journal ${dto.id} not found.`)};
    return {outcome: true};
};