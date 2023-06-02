import {ExistsDTO, RegisterUserDTO} from "./users-dtos";
import {ValidationResult} from "../utils/validation-result";
import {BadRequestError, ConflictError} from "../utils/errors";
import {USERS_REPOSITORY} from "../config";

export const validateRegisterUserDTO = async (dto: RegisterUserDTO): Promise<ValidationResult> => {
    if (!dto.username)
        return {status: false, error: new BadRequestError('Username required.')};
    if (!dto.password)
        return {status: false, error: new BadRequestError('Password required.')};
    if (await USERS_REPOSITORY.exists({username: dto.username}))
        return {status: false, error: new ConflictError('Username taken.')};
    return {status: true};
};

export const validateExistsDTO = async (dto: ExistsDTO): Promise<ValidationResult> => {
    if (!dto.username)
        return {status: false, error: new BadRequestError('Username required.')};
    return {status: true};
};
