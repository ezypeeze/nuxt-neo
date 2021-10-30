/* eslint-disable no-var */

interface NeoError extends Error {
    statusCode: number;
    httpError: boolean;
}

interface NeoErrorConstructor {
    new(message?: string): NeoError;
    readonly prototype: Error;
}

interface NeoBadRequestError extends NeoError {
    errors?: string[];
}

interface NeoBadRequestErrorConstructor {
    new(message?: string, errors?: string[]): NeoBadRequestError;
    readonly prototype: Error;
}

declare var BadRequestError: NeoBadRequestErrorConstructor;
declare var UnauthorizedError: NeoErrorConstructor;
declare var ForbiddenError: NeoErrorConstructor;
declare var NotFoundError: NeoErrorConstructor;
declare var InternalServerError: NeoErrorConstructor;
