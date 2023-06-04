import {User} from "./user";
import {USERS_REPOSITORY} from "../repositories-config";
import {
    DeleteUserDTO,
    GetUserDTO,
    GetUsersDTO,
    RegisterUserDTO,
    UpdateUserDTO,
} from "./users-dtos";
import {
    validateDeleteUserDTO,
    validateGetUserDTO,
    validateGetUsersDTO,
    validateRegisterUserDTO,
    validateUpdateUserDTO
} from "./users-dto-validator";
import {ValidationResult} from "../utils/validation-result";

export const UsersController = {
    getUser: async (user: User, dto: GetUserDTO): Promise<User> => {
        const validationResult: ValidationResult = await validateGetUserDTO(user, dto);
        if (!validationResult.status)
            throw validationResult.error;
        return USERS_REPOSITORY.getUser(dto);
    },

    getUsers: async (user: User, dto: GetUsersDTO): Promise<User[]> => {
        const validationResult: ValidationResult = await validateGetUsersDTO(user, dto);
        if (!validationResult.status)
            throw validationResult.error;
        return USERS_REPOSITORY.getUsers(dto);
    },

    registerUser: async (dto: RegisterUserDTO): Promise<User> => {
        const validationResult: ValidationResult = await validateRegisterUserDTO(dto);
        if (!validationResult.status)
            throw validationResult.error;
        return USERS_REPOSITORY.registerUser(dto);
    },

    deleteUser: async (user: User, dto: DeleteUserDTO): Promise<User> => {
        const validationResult: ValidationResult = await validateDeleteUserDTO(user, dto);
        if (!validationResult.status)
            throw validationResult.error;
        return USERS_REPOSITORY.deleteUser(dto);
    },

    updateUser: async (user: User, dto: UpdateUserDTO): Promise<User> => {
        const validationResult: ValidationResult = await validateUpdateUserDTO(user, dto);
        if (!validationResult.status)
            throw validationResult.error;
        return USERS_REPOSITORY.updateUser(dto);
    },
};