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
} from "./users-dtos-validator";
import {ValidationResult} from "../utils/validation-result";
import {UsersRepository} from "./users-repository";

const repository: UsersRepository = USERS_REPOSITORY;

export const UsersService = {
    getUser: async (user: User, dto: GetUserDTO): Promise<User> => {
        const validationResult: ValidationResult = await validateGetUserDTO(user, dto);
        if (!validationResult.outcome)
            throw validationResult.error;
        return repository.getUser(dto);
    },

    getUsers: async (user: User, dto: GetUsersDTO): Promise<User[]> => {
        const validationResult: ValidationResult = await validateGetUsersDTO(user, dto);
        if (!validationResult.outcome)
            throw validationResult.error;
        return repository.getUsers(dto);
    },

    registerUser: async (dto: RegisterUserDTO): Promise<User> => {
        const validationResult: ValidationResult = await validateRegisterUserDTO(dto);
        if (!validationResult.outcome)
            throw validationResult.error;
        return repository.registerUser(dto);
    },

    deleteUser: async (user: User, dto: DeleteUserDTO): Promise<User> => {
        const validationResult: ValidationResult = await validateDeleteUserDTO(user, dto);
        if (!validationResult.outcome)
            throw validationResult.error;
        return repository.deleteUser(dto);
    },

    updateUser: async (user: User, dto: UpdateUserDTO): Promise<User> => {
        const validationResult: ValidationResult = await validateUpdateUserDTO(user, dto);
        if (!validationResult.outcome)
            throw validationResult.error;
        return repository.updateUser(dto);
    },
};