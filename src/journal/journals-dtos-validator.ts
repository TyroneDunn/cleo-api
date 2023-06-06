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
import {User} from "../user/user";

export const validateGetJournalDTO = async (user: User, dto: GetJournalDTO): Promise<ValidationResult> => {
    if (!user._id.toString())
        return {outcome: false, error: new BadRequestError('Journal ID required.')};
    if (!(await JOURNALS_REPOSITORY.exists(dto.id)))
        return {outcome: false, error: new NotFoundError(`Journal ${dto.id} not found.`)};
    if (!(await JOURNALS_REPOSITORY.ownsJournal(user._id.toString(), dto.id)))
        return {outcome: false, error: new UnauthorizedError(`Unauthorized access to journal ${dto.id}`)};
    return {outcome: true};
};

export const validateGetJournalsDTO = async (user: User, dto: GetJournalsDTO): Promise<ValidationResult> => {
    if (dto.name && dto.nameRegex) {
        return {outcome: false, error: new BadRequestError('Invalid query.')};
    }
    return {outcome: true};
};

export const validateCreateJournalDTO = async (user: User, dto: CreateJournalDTO): Promise<ValidationResult> => {
    if (!dto.name)
        return {outcome: false, error: new BadRequestError('Journal name required.')};
    return {outcome: true};
};

export const validateDeleteJournalDTO = async (user: User, dto: DeleteJournalDTO): Promise<ValidationResult> => {
    if (!dto.id)
        return {outcome: false, error: new BadRequestError('Journal ID required.')};
    if (!(await JOURNALS_REPOSITORY.exists(dto.id)))
        return {outcome: false, error: new NotFoundError(`Journal ${dto.id} not found.`)};
    if (!(await JOURNALS_REPOSITORY.ownsJournal(user._id.toString(), dto.id)))
        return {outcome: false, error: new UnauthorizedError(`Unauthorized access to journal ${dto.id}`)};
    return {outcome: true};
};

export const validateUpdateJournalDTO = async (user: User, dto: UpdateJournalDTO): Promise<ValidationResult> => {
    if (!dto.id)
        return {outcome: false, error: new BadRequestError('Journal ID required.')};
    if (!dto.name)
        return {outcome: false, error: new BadRequestError('Journal name required.')};
    if (!(await JOURNALS_REPOSITORY.exists(dto.id)))
        return {outcome: false, error: new NotFoundError(`Journal ${dto.id} not found.`)};
    if (!(await JOURNALS_REPOSITORY.ownsJournal(user._id.toString(), dto.id)))
        return {outcome: false, error: new UnauthorizedError(`Unauthorized access to journal ${dto.id}`)};
    return {outcome: true};
};
