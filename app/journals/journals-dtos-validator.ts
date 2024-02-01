import {
    CreateJournalRequest,
    DeleteJournalRequest,
    DeleteJournalsRequest,
    GetJournalRequest,
    GetJournalsRequest,
    UpdateJournalRequest
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
import {JournalsRepository} from "./journals-repository";
import {UsersRepository} from "../user/users-repository";

const journalsRepository: JournalsRepository = JOURNALS_REPOSITORY;
const usersRepository: UsersRepository = USERS_REPOSITORY;

export const validateGetJournalDTO = async (user: User, dto: GetJournalRequest): Promise<ValidationResult> => {
    if (!user)
        return {error: new UnauthorizedError('Unauthorized.')};
    if (!dto.id)
        return {error: new BadRequestError('JournalsTypes ID required.')};
    if (!(await journalsRepository.exists(dto.id)))
        return {error: new NotFoundError(`Journal ${dto.id} not found.`)};
    if (!(await journalsRepository.ownsJournal(user.username, dto.id)) && !(await usersRepository.isAdmin(user.username)))
        return {error: new ForbiddenError('Insufficient permissions.')};
    return {};
};

export const validateGetJournalsDTO = async (user: User, dto: GetJournalsRequest): Promise<ValidationResult> => {
    if (!user)
        return {error: new UnauthorizedError('Unauthorized.')};
    if (!(await usersRepository.isAdmin(user.username)) && (user.username !== dto.author))
        return {error: new ForbiddenError('Insufficient permissions.')};
    if (dto.name && dto.nameRegex)
        return {error: new BadRequestError('Invalid query. Provide either "name" or "nameRegex".')};
    if (dto.author && dto.authorRegex)
        return {error: new BadRequestError('Invalid query. Provide either "author" or' +
                ' "authorRegex"')};
    if (dto.startDate) {
        if (isNaN(Date.parse(dto.startDate)))
            return {error: new BadRequestError('Invalid start date query. Provide a ISO date string.')};
    }
    if (dto.endDate) {
        if (isNaN(Date.parse(dto.endDate)))
            return {error: new BadRequestError('Invalid end date query. Provide a ISO date string.')};
    }
    if (dto.sort) {
        if (dto.sort !== 'id' && dto.sort !== 'name' && dto.sort !== 'lastUpdated' && dto.sort !== 'dateCreated')
            return {error: new BadRequestError('Invalid query. Sort option must' +
                    ' be id, name, lastUpdated, or dateCreated.')};
    }
    if (dto.order !== undefined) {
        if ((dto.order !== 'asc' && dto.order !== 'desc'))
            return {error: new BadRequestError('Invalid query. Order must be' +
                    ' "asc" or "desc".')};
    }
    if (dto.page !== undefined) {
        if (dto.page < 0)
            return {error: new BadRequestError('Invalid query. Page must be' +
                    ' 0 or greater.')};
    }
    if (dto.limit !== undefined) {
        if (dto.limit < 0)
            return {error: new BadRequestError('Invalid query. Limit must be' +
                    ' 0 or greater.')};
    }
    return {};
};

export const validateCreateJournalDTO = async (user: User, dto: CreateJournalRequest): Promise<ValidationResult> => {
    if (!user)
        return {error: new UnauthorizedError('Unauthorized.')};
    if (!dto.name)
        return {error: new BadRequestError('JournalsTypes name required.')};
    if (!dto.author)
        return {error: new BadRequestError('JournalsTypes author required.')};
    return {};
};

export const validateUpdateJournalDTO = async (user: User, dto: UpdateJournalRequest): Promise<ValidationResult> => {
    if (!user)
        return {error: new UnauthorizedError('Unauthorized.')};
    if (!dto.id)
        return {error: new BadRequestError('JournalsTypes ID required.')};
    if (!dto.name)
        return {error: new BadRequestError('JournalsTypes name required.')};
    if (!(await journalsRepository.ownsJournal(user.username, dto.id)) && !(await usersRepository.isAdmin(user.username)))
        return {error: new ForbiddenError('Insufficient permissions.')};
    if (!(await journalsRepository.exists(dto.id)))
        return {error: new NotFoundError(`Journal ${dto.id} not found.`)};
    return {};
};

export const validateDeleteJournalDTO = async (user: User, dto: DeleteJournalRequest): Promise<ValidationResult> => {
    if (!dto.id)
        return {error: new BadRequestError('JournalsTypes ID required.')};
    if (!(await journalsRepository.ownsJournal(user.username, dto.id)) && !(await usersRepository.isAdmin(user.username)))
        return {error: new ForbiddenError('Insufficient permissions.')};
    if (!(await journalsRepository.exists(dto.id)))
        return {error: new NotFoundError(`Journal ${dto.id} not found.`)};
    return {};
};

export const validateDeleteJournalsDTO = async (user: User, dto: DeleteJournalsRequest): Promise<ValidationResult> => {
    if (!user)
        return {error: new UnauthorizedError('Unauthorized.')};
    if (!(await usersRepository.isAdmin(user.username)) && (user.username !== dto.author))
        return {error: new ForbiddenError('Insufficient permissions.')};
    if (dto.name && dto.nameRegex)
        return {error: new BadRequestError('Invalid query. Provide either "name" or "nameRegex".')};
    if (dto.author && dto.authorRegex)
        return {error: new BadRequestError('Invalid query. Provide either "author" or' +
                ' "authorRegex".')};
    if (dto.startDate) {
        if (isNaN(Date.parse(dto.startDate)))
            return {error: new BadRequestError('Invalid start date query. Provide a ISO date string.')};
    }
    if (dto.endDate) {
        if (isNaN(Date.parse(dto.endDate)))
            return {error: new BadRequestError('Invalid end date query. Provide a ISO date string.')};
    }
    return {};
};