import {
    DeleteUserDTO,
    DeleteUsersDTO,
    GetUserDTO,
    GetUsersDTO,
    RegisterAdminDTO,
    RegisterUserDTO,
    UpdateUserDTO,
    UpdateUsersDTO
} from "./users-dtos";
import {ValidationResult} from "../utils/validation-result";
import {
    BadRequestError,
    ConflictError,
    ForbiddenError,
    NotFoundError,
    UnauthorizedError
} from "../utils/errors";
import {USERS_REPOSITORY} from "../repositories-config";
import {User} from "./users.types";

export const validateRegisterUserDTO = async (dto: RegisterUserDTO): Promise<ValidationResult> => {
    if (!dto.username)
        return {error: new BadRequestError('Username required.')};
    if (!dto.password)
        return {error: new BadRequestError('Password required.')};
    if (await USERS_REPOSITORY.exists(dto.username))
        return {error: new ConflictError('Username taken.')};
    return {};
};

export const validateRegisterAdminDTO = async (user: User, dto: RegisterAdminDTO): Promise<ValidationResult> => {
    if (!(user))
        return {error: new UnauthorizedError('Unauthorized.')};
    if (!dto.username)
        return {error: new BadRequestError('Username required.')};
    if (!dto.password)
        return {error: new BadRequestError('Password required.')};
    if (!(await USERS_REPOSITORY.isAdmin(user.username)))
        return {error: new ForbiddenError('Insufficient permissions.')};
    if (await USERS_REPOSITORY.exists(dto.username))
        return {error: new ConflictError('Username taken.')};
    return {};
};

export const validateGetUserDTO = async (user: User, dto: GetUserDTO): Promise<ValidationResult> => {
    if (!(user))
        return {error: new UnauthorizedError('Unauthorized.')};
    if (!(await USERS_REPOSITORY.isAdmin(user.username)))
        return {error: new ForbiddenError('Insufficient permissions.')};
    if (!dto.username)
        return {error: new BadRequestError('Username required.')};
    if (!(await USERS_REPOSITORY.exists(dto.username)))
        return {error: new NotFoundError('User not found.')};
    return {};
};

export const validateGetUsersDTO = async (user: User, dto: GetUsersDTO): Promise<ValidationResult> => {
    if (!(user))
        return {error: new UnauthorizedError('Unauthorized.')};
    if (!(await USERS_REPOSITORY.isAdmin(user.username)))
        return {error: new ForbiddenError('Insufficient permissions.')};
    if (dto.username && dto.usernameRegex)
        return {error: new BadRequestError('Invalid query. Provide either "username" or' +
                ' "usernameRegex".')};
    if (dto.isAdmin) {
        if (dto.isAdmin.toLowerCase() !== 'true' && dto.isAdmin.toLowerCase() !== 'false')
            return {error: new BadRequestError('Invalid query. isAdmin must be' +
                    ' true or false')};
    }
    if (dto.status) {
        if (dto.status !== 'active' && dto.status !== 'inactive' && dto.status !== 'suspended')
            return {error: new BadRequestError('Invalid query. Status must be' +
                    ' active, inactive, or suspended.')};
    }
    if (dto.sort) {
        if (dto.sort !== 'id' && dto.sort !== 'username' && dto.sort !== 'lastUpdated' && dto.sort !== 'dateCreated')
            return {error: new BadRequestError('Invalid query. Sort option must' +
                    ' be id, username, lastUpdated, or dateCreated.')};
    }
    if (dto.order !== undefined) {
        if ((dto.order !== 1 && dto.order !== -1))
            return {error: new BadRequestError('Invalid query. Order must be' +
                    ' 1 or -1.')};
    }
    if (dto.page !== undefined) {
        if (dto.page < 1)
            return {error: new BadRequestError('Invalid query. Page must be' +
                    ' 1 or greater.')};
    }
    if (dto.limit !== undefined) {
        if (dto.limit < 0)
            return {error: new BadRequestError('Invalid query. Limit must be' +
                    ' 0 or greater.')};
    }
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

export const validateUpdateUsersDTO = async (user: User, dto: UpdateUsersDTO): Promise<ValidationResult> => {
    if (!(user))
        return {error: new UnauthorizedError('Unauthorized.')};
    if (!(await USERS_REPOSITORY.isAdmin(user.username)))
        return {error: new ForbiddenError('Insufficient permissions.')};
    if (dto.isAdmin) {
        if (dto.isAdmin.toLowerCase() !== 'true' && dto.isAdmin.toLowerCase() !== 'false')
            return {error: new BadRequestError('Invalid query. isAdmin must be' +
                    ' true or false')};
    }
    if (dto.status) {
        if (dto.status !== 'active' && dto.status !== 'inactive' && dto.status !== 'suspended')
            return {error: new BadRequestError('Invalid query. Status must be' +
                    ' active, inactive, or suspended.')};
    }
    if (dto.startDate) {
        if (isNaN(Date.parse(dto.startDate)))
            return {error: new BadRequestError('Invalid start date query. Provide a ISO date string.')};
    }
    if (dto.endDate) {
        if (isNaN(Date.parse(dto.endDate)))
            return {error: new BadRequestError('Invalid end date query. Provide a ISO date string.')};
    }
    if (dto.newIsAdmin) {
        if (dto.newIsAdmin.toLowerCase() !== 'true' && dto.newIsAdmin.toLowerCase() !== 'false')
            return {error: new BadRequestError('Invalid query. isAdmin must be' +
                    ' true or false')};
    }
    if (dto.newStatus) {
        if (dto.newStatus !== 'active' && dto.newStatus !== 'inactive' && dto.newStatus !== 'suspended')
            return {error: new BadRequestError('Invalid query. Status must be' +
                    ' active, inactive, or suspended.')};
    }
    return {};
}

export const validateUpdateUserDTO = async (user: User, dto: UpdateUserDTO): Promise<ValidationResult> => {
    if (!(user))
        return {error: new UnauthorizedError('Unauthorized.')};
    if (user.username !== dto.username &&
        !(await USERS_REPOSITORY.isAdmin(user.username)))
        return {error: new ForbiddenError('Insufficient permissions.')};
    if (!(await USERS_REPOSITORY.exists(dto.username)))
        return {error: new NotFoundError(`User ${dto.username} not found.`)};
    if (dto.newUsername) {
        if (dto.newUsername.length < 3)
            return {error: new BadRequestError('Username must be at least 3' +
                    ' characters.')};
        if (await USERS_REPOSITORY.exists(dto.newUsername))
            return {error: new ConflictError('Username already taken.')};
    }
    if (dto.newPassword) {
        if (dto.newPassword.length < 8)
            return {error: new BadRequestError('Password must be at least 8' +
                    ' characters.')};
    }
    if (dto.newIsAdmin) {
        if (!(await USERS_REPOSITORY.isAdmin(user.username)))
            return {error: new ForbiddenError('Insufficient permissions.')};

        if (dto.newIsAdmin.toLowerCase() !== 'true' && dto.newIsAdmin.toLowerCase() !== 'false')
            return {error: new BadRequestError('Invalid query. isAdmin must be' +
                    ' true or false')};
    }
    if (dto.newStatus) {
        if (!(await USERS_REPOSITORY.isAdmin(user.username)))
            return {error: new ForbiddenError('Insufficient permissions.')};

        if (dto.newStatus !== 'active' && dto.newStatus !== 'inactive' && dto.newStatus !== 'suspended')
            return {error: new BadRequestError('Invalid query. Status must be' +
                    ' active, inactive, or suspended.')};
    }
    return {};
};

export const validateDeleteUsersDTO = async (user: User, dto: DeleteUsersDTO): Promise<ValidationResult> => {
    if (!(user))
        return {error: new UnauthorizedError('Unauthorized.')};
    if (!(await USERS_REPOSITORY.isAdmin(user.username)))
        return {error: new ForbiddenError('Insufficient permissions.')};
    if (dto.isAdmin) {
        if (dto.isAdmin.toLowerCase() !== 'true' && dto.isAdmin.toLowerCase() !== 'false')
            return {error: new BadRequestError('Invalid query. isAdmin must be' +
                    ' true or false')};
    }
    if (dto.status) {
        if (dto.status !== 'active' && dto.status !== 'inactive' && dto.status !== 'suspended')
            return {error: new BadRequestError('Invalid query. Status must be' +
                    ' active, inactive, or suspended.')};
    }
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

export const validateDeleteUserDTO = async (user: User, dto: DeleteUserDTO): Promise<ValidationResult> => {
    if (!(user))
        return {error: new UnauthorizedError('Unauthorized.')};
    if (!(await USERS_REPOSITORY.isAdmin(user.username)))
        return {error: new ForbiddenError('Insufficient permissions.')};
    if (!dto.username)
        return {error: new BadRequestError('Username required.')};
    if (!(await USERS_REPOSITORY.exists(dto.username)))
        return {error: new NotFoundError(`User ${dto.username} not found.`)};
    return {};
};