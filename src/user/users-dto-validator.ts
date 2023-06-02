import {ExistsDTO, RegisterUserDTO} from "./users-dtos";
import {ValidationResult} from "../utils/validation-result";
import {BadRequestError} from "../utils/errors";

export const validateRegisterUserDTO = async (dto: RegisterUserDTO): Promise<ValidationResult> => {
    if (!dto.username)
        return {status: false, error: new BadRequestError('Username required.')};
    if (!dto.password)
        return {status: false, error: new BadRequestError('Password required.')};
    return {status: true};
};

export const validateExistsDTO = async (dto: ExistsDTO): Promise<ValidationResult> => {
    if (!dto.username)
        return {status: false, error: new BadRequestError('Username required.')};
    return {status: true};
};
