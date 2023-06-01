export class BadRequestError implements Error {
    constructor(message: string) {
        this.message = message;
    }
    message: string;
    name: string;
}

export class NotFoundError implements Error {
    constructor(message: string) {
        this.message = message;
    }
    message: string;
    name: string;
}

export class UnauthorizedError implements Error {
    constructor(message: string) {
        this.message = message;
    }
    message: string;
    name: string;
}