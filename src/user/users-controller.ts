import {User} from "./user.type";
import {USERS_REPOSITORY} from "../config";
import {QueryArgs} from "./users-repository";
import {RegisterUserDTO} from "./users-dtos";
import {generateHash} from "../utils/password-utils";
import {validateExistsDTO, validateRegisterUserDTO} from "./users-dto-validator";
import {ValidationResult} from "../utils/validation-result";

export const UsersController = {
    registerUser: async (dto: RegisterUserDTO): Promise<User> => {
        const validationResult: ValidationResult = await validateRegisterUserDTO(dto);
        if (!validationResult.status)
            throw validationResult.error;

        const args: QueryArgs = {
            username: dto.username,
            hash: generateHash(dto.password),
        };
        return USERS_REPOSITORY.registerUser(args);
    },

    exists: async (dto: RegisterUserDTO): Promise<boolean> => {
        const validationResult: ValidationResult = await validateExistsDTO(dto);
        if (!validationResult.status)
            throw validationResult.error;

        const args: QueryArgs = {
            username: dto.username,
        };
        return USERS_REPOSITORY.exists(args);
    },
};