import {
    DeleteUserRequest,
    DeleteUsersRequest, GetUserRequest, GetUsersRequest, RegisterAdminRequest, RegisterUserRequest,
    UpdateUserRequest,
    UpdateUsersRequest,
    User,
} from "./users.types";
import {USERS_REPOSITORY} from "../repositories-config";
import {
    validateDeleteUserDTO,
    validateDeleteUsersDTO,
    validateGetUserDTO,
    validateGetUsersDTO,
    validateRegisterAdminDTO,
    validateRegisterUserDTO,
    validateUpdateUserDTO,
    validateUpdateUsersDTO
} from "./users.validator";
import {ValidationResult} from "../utils/validation-result";
import {UsersRepository} from "./users-repository.type";

const repository: UsersRepository = USERS_REPOSITORY;

export const getUser = async (user: User, dto: GetUserRequest): Promise<User> => {
    const validationResult: ValidationResult = await validateGetUserDTO(user, dto);
    if (validationResult.error) throw validationResult.error;
    return repository.getUser(dto);
};

export const getUsers = async (user: User, dto: GetUsersRequest): Promise<User[]> => {
    const validationResult: ValidationResult = await validateGetUsersDTO(user, dto);
    if (validationResult.error) throw validationResult.error;
    return repository.getUsers(dto);
};

export const registerUser = async (dto: RegisterUserRequest): Promise<User> => {
    const validationResult: ValidationResult = await validateRegisterUserDTO(dto);
    if (validationResult.error) throw validationResult.error;
    return repository.registerUser(dto);
};

export const registerAdminUser = async (user: User, dto: RegisterAdminRequest): Promise<User> => {
    const validationResult: ValidationResult = await validateRegisterAdminDTO(user, dto);
    if (validationResult.error) throw validationResult.error;
    return repository.registerAdminUser(dto);
};

export const updateUsers = async (user: User, dto: UpdateUsersRequest): Promise<User[]> => {
    const validationResult: ValidationResult = await validateUpdateUsersDTO(user, dto);
    if (validationResult.error) throw validationResult.error;
    return repository.updateUsers(dto);
};

export const updateUser = async (user: User, dto: UpdateUserRequest): Promise<User> => {
    const validationResult: ValidationResult = await validateUpdateUserDTO(user, dto);
    if (validationResult.error) throw validationResult.error;
    return repository.updateUser(dto);
};

export const deleteUsers = async (user: User, dto: DeleteUsersRequest): Promise<string> => {
    const validationResult: ValidationResult = await validateDeleteUsersDTO(user, dto);
    if (validationResult.error) throw validationResult.error;
    return repository.deleteUsers(dto);
};

export const deleteUser = async (user: User, dto: DeleteUserRequest): Promise<User> => {
    const validationResult: ValidationResult = await validateDeleteUserDTO(user, dto);
    if (validationResult.error) throw validationResult.error;
    return repository.deleteUser(dto);
};
