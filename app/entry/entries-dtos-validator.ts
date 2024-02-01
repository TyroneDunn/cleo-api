import {
    CreateEntryDTO,
    GetEntriesDTO,
    GetEntryDTO,
    UpdateEntryDTO,
    DeleteEntryDTO,
    DeleteEntriesDTO,
} from "./entries-dtos";
import {ValidationResult} from "../utils/validation-result";
import {
    BadRequestError,
    ForbiddenError,
    NotFoundError,
    UnauthorizedError
} from "../utils/errors";
import {
    ENTRIES_REPOSITORY,
    JOURNALS_REPOSITORY,
    USERS_REPOSITORY
} from "../repositories-config";
import {User} from "../user/user";
import {UsersRepository} from "../user/users-repository";
import {JournalsRepository} from "../journals/journals-repository.type";
import {EntriesRepository} from "./entries-repository";

const usersRepository: UsersRepository = USERS_REPOSITORY;
const journalsRepository: JournalsRepository = JOURNALS_REPOSITORY;
const entriesRepository: EntriesRepository = ENTRIES_REPOSITORY;

export const validateGetEntryDTO = async (user: User, dto: GetEntryDTO): Promise<ValidationResult> => {
    if (!(user))
        return {error: new UnauthorizedError('Unauthorized.')};
    if (!dto.id)
        return {error: new BadRequestError('Entry ID required.')};
    if (!(await entriesRepository.exists(dto.id)))
        return {error: new NotFoundError(`Entry ${dto.id} not found.`)};
    if (!(await usersRepository.isAdmin(user.username)) && !(await entriesRepository.ownsEntry(user.username, dto.id)))
        return {error: new ForbiddenError('Insufficient permissions.')};
    return {};
};

export const validateGetEntriesDTO = async (user: User, dto: GetEntriesDTO): Promise<ValidationResult> => {
    if (!(user))
        return {error: new UnauthorizedError('Unauthorized.')};
    if (dto.journal)
        if (!(await journalsRepository.exists(dto.journal)))
            return {error: new NotFoundError(`Journal ${dto.journal} not found.`)};
    if (!(await usersRepository.isAdmin(user.username)) && !(await journalsRepository.ownsJournal(user.username, dto.journal)))
        return {error: new ForbiddenError('Insufficient permissions.')};
    if ((dto.title && dto.titleRegex))
        return {error: new BadRequestError('Invalid query. Provide either "title" or' +
                ' "titleRegex".')};
    if ((dto.body && dto.bodyRegex))
        return {error: new BadRequestError('Invalid query. Provide either "body" or "bodyRegex".')};
    if (dto.startDate)
        if (isNaN(Date.parse(dto.startDate)))
            return {error: new BadRequestError('Invalid start date query. Provide a ISO date string.')};
    if (dto.endDate)
        if (isNaN(Date.parse(dto.endDate)))
            return {error: new BadRequestError('Invalid end date query. Provide a ISO date string.')};
    if (dto.sort)
        if (dto.sort !== 'id' && dto.sort !== 'title'&& dto.sort !== 'body' && dto.sort !== 'journal' && dto.sort !== 'lastUpdated' && dto.sort !== 'dateCreated')
            return {error: new BadRequestError('Invalid query. Sort option must' +
                    ' be id, title, body, journals, lastUpdated, or dateCreated.')};
    if (dto.order !== undefined)
        if ((dto.order !== 'asc' && dto.order !== 'desc'))
            return {error: new BadRequestError('Invalid query. Order must be' +
                    ' "asc" or "desc".')};
    if (dto.page !== undefined)
        if (dto.page < 0)
            return {error: new BadRequestError('Invalid query. Page must be' +
                    ' 0 or greater.')};
    if (dto.limit !== undefined)
        if (dto.limit < 0)
            return {error: new BadRequestError('Invalid query. Limit must be' +
                    ' 0 or greater.')};
    return {};
};

export const validateCreateEntryDTO = async (user: User, dto: CreateEntryDTO): Promise<ValidationResult> => {
    if (!user)
        return {error: new UnauthorizedError('Unauthorized.')};
    if (!dto.journal)
        return {error: new BadRequestError('JournalsTypes required.')};
    if (!(await journalsRepository.exists(dto.journal)))
        return {error: new NotFoundError(`Journal ${dto.journal} not found.`)};
    if (!(await usersRepository.isAdmin(user.username)) && !(await journalsRepository.ownsJournal(user.username, dto.journal)))
        return {error: new ForbiddenError('Insufficient permissions.')};
    return {};
};

export const validateUpdateEntryDTO = async (user: User, dto: UpdateEntryDTO): Promise<ValidationResult> => {
    if (!user)
        return {error: new UnauthorizedError('Unauthorized.')};
    if (!dto.id)
        return {error: new BadRequestError('Entry ID required.')};
    if (!(await usersRepository.isAdmin(user.username)) && !(await entriesRepository.ownsEntry(user.username, dto.id)))
        return {error: new ForbiddenError('Insufficient permissions.')};
    if (!(await entriesRepository.exists(dto.id)))
        return {error: new NotFoundError(`Entry ${dto.id} not found.`)};
    if ((!dto.body) && (!dto.journal) && (!dto.title))
        return {error: new BadRequestError('Update field required.')};
    if (dto.journal) {
        if (!(await journalsRepository.exists(dto.journal)))
            return {error: new NotFoundError(`Journal ${dto.journal} not found.`)};
    }
    return {};
};

export const validateDeleteEntryDTO = async (user: User, dto: DeleteEntryDTO): Promise<ValidationResult> => {
    if (!dto.id)
        return {error: new BadRequestError('Entry ID required.')};
    if (!(await ENTRIES_REPOSITORY.exists(dto.id)))
        return {error: new NotFoundError(`Entry ${dto.id} not found.`)};
    if (!(await ENTRIES_REPOSITORY.ownsEntry(user.username, dto.id)))
        return {error: new UnauthorizedError(`Unauthorized access to entry ${dto.id}`)};
    return {};
};

export const validateDeleteEntriesDTO = async (user: User, dto: DeleteEntriesDTO): Promise<ValidationResult> => {
    if (!user)
        return {error: new UnauthorizedError('Unauthorized.')};
    if (dto.journal)
        if (!(await journalsRepository.exists(dto.journal)))
            return {error: new NotFoundError(`Journal ${dto.journal} not found.`)};
    if (!(await usersRepository.isAdmin(user.username)) && !(await journalsRepository.ownsJournal(user.username, dto.journal)))
        return {error: new ForbiddenError('Insufficient permissions.')};
    if ((dto.title && dto.titleRegex))
        return {error: new BadRequestError('Invalid query. Provide either "title" or' +
                ' "titleRegex".')};
    if ((dto.body && dto.bodyRegex))
        return {error: new BadRequestError('Invalid query. Provide either "body" or "bodyRegex".')};
    if (dto.startDate)
        if (isNaN(Date.parse(dto.startDate)))
            return {error: new BadRequestError('Invalid start date query. Provide a ISO date string.')};
    if (dto.endDate)
        if (isNaN(Date.parse(dto.endDate)))
            return {error: new BadRequestError('Invalid end date query. Provide a ISO date string.')};
    return {};
};