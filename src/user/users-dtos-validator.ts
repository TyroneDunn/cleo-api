import {DeleteUserDTO, GetUserDTO, GetUsersDTO, RegisterUserDTO, UpdateUserDTO} from "./users-dtos";
import {ValidationResult} from "../utils/validation-result";
import {BadRequestError, ConflictError, ForbiddenError, NotFoundError} from "../utils/errors";
import {USERS_REPOSITORY} from "../repositories-config";
import {User} from "./user";

export const validateRegisterUserDTO = async (dto: RegisterUserDTO): Promise<ValidationResult> => {
    if (!dto.username)
        return {status: false, error: new BadRequestError('Username required.')};
    if (!dto.password)
        return {status: false, error: new BadRequestError('Password required.')};
    if (await USERS_REPOSITORY.exists(dto.username))
        return {status: false, error: new ConflictError('Username taken.')};
    return {status: true};
};

export const validateGetUserDTO = async (user: User, dto: GetUserDTO): Promise<ValidationResult> => {
    if (!dto.id && !dto.username)
        return {status: false, error: new BadRequestError('User ID or username required.')};
    if (!(await USERS_REPOSITORY.isAdmin(user._id.toString())))
        return {status: false, error: new ForbiddenError('Unauthorized.')};
    if (!(await USERS_REPOSITORY.exists(dto.id)))
        return {status: false, error: new NotFoundError('User not found.')};
    return {status: true};
};

export const validateGetUsersDTO = async (user: User, dto: GetUsersDTO): Promise<ValidationResult> => {
    if ((dto.id && dto.idRegex) ||
        (dto.username && dto.usernameRegex))
        return {status: false, error: new BadRequestError('Invalid query.')};
    if (!(await USERS_REPOSITORY.isAdmin(dto.senderId)))
        return {status: false, error: new ForbiddenError('Unauthorized.')};
    return {status: true};
};

export const validateDeleteUserDTO = async (user: User, dto: DeleteUserDTO): Promise<ValidationResult> => {
    if (!dto.senderId)
        return {status: false, error: new BadRequestError('Sender ID required.')};
    if (!dto.id)
        return {status: false, error: new BadRequestError('User ID required.')};
    if (!(await USERS_REPOSITORY.isAdmin(dto.senderId)))
        return {status: false, error: new ForbiddenError('Unauthorized.')};
    if (!(await USERS_REPOSITORY.exists(dto.id)))
        return {status: false, error: new NotFoundError(`User ${dto.id} not found.`)};
    return {status: true};
};

export const validateUpdateUserDTO = async (user: User, dto: UpdateUserDTO): Promise<ValidationResult> => {
    if (!dto.senderId)
        return {status: false, error: new BadRequestError('Sender ID required.')};
    if (!dto.id)
        return {status: false, error: new BadRequestError('User ID required.')};
    if (dto.senderId !== dto.id &&
        !(await USERS_REPOSITORY.isAdmin( dto.senderId)))
        return {status: false, error: new ForbiddenError('Unauthorized.')};
    if (!(await USERS_REPOSITORY.exists(dto.id)))
        return {status: false, error: new NotFoundError(`User ${dto.id} not found.`)};
    return {status: true};
};
