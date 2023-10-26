import {User} from "./user";
import {USERS_REPOSITORY} from "../../repositories-config";
import {
    DeleteUserDTO,
    DeleteUsersDTO,
    GetUserDTO,
    GetUsersDTO,
    RegisterAdminDTO,
    RegisterUserDTO,
    UpdateUserDTO,
    UpdateUsersDTO,
} from "./users-dtos";
import {
    validateDeleteUserDTO,
    validateDeleteUsersDTO,
    validateGetUserDTO,
    validateGetUsersDTO,
    validateRegisterAdminDTO,
    validateRegisterUserDTO,
    validateUpdateUserDTO,
    validateUpdateUsersDTO
} from "./users-dtos-validator";
import {ValidationResult} from "../../utils/validation-result";
import {UsersRepository} from "./users-repository";

const repository: UsersRepository = USERS_REPOSITORY;

export const getUser = async (user: User, dto: GetUserDTO): Promise<User> => {
    const validationResult: ValidationResult = await validateGetUserDTO(user, dto);
    if (validationResult.error) throw validationResult.error;
    return repository.getUser(dto);
};

export const getUsers = async (user: User, dto: GetUsersDTO): Promise<User[]> => {
    const validationResult: ValidationResult = await validateGetUsersDTO(user, dto);
    if (validationResult.error) throw validationResult.error;
    return repository.getUsers(dto);
};

export const registerUser = async (dto: RegisterUserDTO): Promise<User> => {
    const validationResult: ValidationResult = await validateRegisterUserDTO(dto);
    if (validationResult.error) throw validationResult.error;
    return repository.registerUser(dto);
};

export const registerAdminUser = async (user: User, dto: RegisterAdminDTO): Promise<User> => {
    const validationResult: ValidationResult = await validateRegisterAdminDTO(user, dto);
    if (validationResult.error) throw validationResult.error;
    return repository.registerAdminUser(dto);
};

export const updateUsers = async (user: User, dto: UpdateUsersDTO): Promise<User[]> => {
    const validationResult: ValidationResult = await validateUpdateUsersDTO(user, dto);
    if (validationResult.error) throw validationResult.error;
    return repository.updateUsers(dto);
};

export const updateUser = async (user: User, dto: UpdateUserDTO): Promise<User> => {
    const validationResult: ValidationResult = await validateUpdateUserDTO(user, dto);
    if (validationResult.error) throw validationResult.error;
    return repository.updateUser(dto);
};

export const deleteUsers = async (user: User, dto: DeleteUsersDTO): Promise<string> => {
    const validationResult: ValidationResult = await validateDeleteUsersDTO(user, dto);
    if (validationResult.error) throw validationResult.error;
    return repository.deleteUsers(dto);
};

export const deleteUser = async (user: User, dto: DeleteUserDTO): Promise<User> => {
    const validationResult: ValidationResult = await validateDeleteUserDTO(user, dto);
    if (validationResult.error) throw validationResult.error;
    return repository.deleteUser(dto);
};
