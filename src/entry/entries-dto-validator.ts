import {
    CreateEntryDTO,
    DeleteEntryDTO,
    GetEntriesDTO,
    GetEntryDTO,
    UpdateEntryDTO
} from "./entries-dtos";
import {ValidationResult} from "../utils/validation-result";
import {BadRequestError, NotFoundError, UnauthorizedError} from "../utils/errors";
import {ENTRIES_REPOSITORY} from "../config";

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

};

export const validateCreateEntryDTO = async (dto: CreateEntryDTO): Promise<ValidationResult> => {

};

export const validateDeleteEntryDTO = async (dto: DeleteEntryDTO): Promise<ValidationResult> => {

};

export const validateUpdateEntryDTO = async (dto: UpdateEntryDTO): Promise<ValidationResult> => {

};
