import {User} from "./user.type";
import {USERS_REPOSITORY} from "../repositories-config";
import {FilterArgs, PaginationArgs, QueryArgs, SortArgs} from "./users-repository";
import {DeleteUserDTO, GetUserDTO, GetUsersDTO, RegisterUserDTO, UpdateUserDTO} from "./users-dtos";
import {generateHash} from "../utils/password-utils";
import {
    validateDeleteUserDTO,
    validateGetUserDTO,
    validateGetUsersDTO,
    validateRegisterUserDTO, validateUpdateUserDTO
} from "./users-dto-validator";
import {ValidationResult} from "../utils/validation-result";

const buildQueryArgs = (dto: GetUsersDTO): QueryArgs => {
    let queryArgs: QueryArgs = {};
    if (dto.id)
        queryArgs.id = dto.id
    if (dto.idRegex)
        queryArgs.idRegex = dto.idRegex
    if (dto.username)
        queryArgs.username = dto.username
    if (dto.usernameRegex)
        queryArgs.usernameRegex = dto.usernameRegex
    return queryArgs;
};

const buildSortArgs = (dto: GetUsersDTO): SortArgs => {
    let sortArgs: SortArgs = {};
    if (dto.sort)
        sortArgs.sort = dto.sort
    dto.order ? sortArgs.order = dto.order : sortArgs.order = 1;
    return sortArgs;
};

const buildFilterArgs = (dto: GetUsersDTO): FilterArgs => {
    let filterArgs: FilterArgs = {};
    if (dto.startDate)
        filterArgs.startDate = dto.startDate;
    if (dto.endDate)
        filterArgs.endDate = dto.endDate;
    return filterArgs;
};

const buildPaginationArgs = (dto: GetUsersDTO): PaginationArgs => {
    const paginationArgs: PaginationArgs = {};
    dto.page ? paginationArgs.page = dto.page : paginationArgs.page = 1;
    dto.limit ? paginationArgs.limit = dto.limit : paginationArgs.limit = 32;
    return paginationArgs;
};

export const UsersController = {
    getUser: async (dto: GetUserDTO): Promise<User> => {
        const validationResult: ValidationResult = await validateGetUserDTO(dto);
        if (!validationResult.status)
            throw validationResult.error;
        const args = {id: dto.id};
        return USERS_REPOSITORY.getUser(args);
    },

    getUsers: async (dto: GetUsersDTO): Promise<User[]> => {
        const validationResult: ValidationResult = await validateGetUsersDTO(dto);
        if (!validationResult.status)
            throw validationResult.error;
        const queryArgs: QueryArgs = buildQueryArgs(dto);
        const sortArgs: SortArgs = buildSortArgs(dto);
        const filterArgs: FilterArgs = buildFilterArgs(dto);
        const paginationArgs: PaginationArgs = buildPaginationArgs(dto);
        return USERS_REPOSITORY.getUsers(queryArgs, sortArgs, filterArgs, paginationArgs);
    },

    registerUser: async (dto: RegisterUserDTO): Promise<User> => {
        const validationResult: ValidationResult = await validateRegisterUserDTO(dto);
        if (!validationResult.status)
            throw validationResult.error;

        const args: QueryArgs = {
            username: dto.username,
            hash: generateHash(dto.password),
            isAdmin: false,
        };
        return USERS_REPOSITORY.registerUser(args);
    },

    deleteUser: async (dto: DeleteUserDTO): Promise<User> => {
        const validationResult: ValidationResult = await validateDeleteUserDTO(dto);
        if (!validationResult.status)
            throw validationResult.error;

        const args: QueryArgs = {id: dto.id};
        return USERS_REPOSITORY.deleteUser(args);
    },

    updateUser: async (dto: UpdateUserDTO): Promise<User> => {
        const validationResult: ValidationResult = await validateUpdateUserDTO(dto);
        if (!validationResult.status)
            throw validationResult.error;

        const args: QueryArgs = {id: dto.senderId};
        if (dto.username)
            args.username = dto.username;
        if (dto.password)
            args.hash = generateHash(dto.password);
        return USERS_REPOSITORY.updateUser(args);
    },
};