global.BadRequestError = class extends Error {
    constructor(message = 'Bad Request', errors) {
        super(message);
        this.errors     = errors;
        this.statusCode = 400;
    }
};

global.UnauthorizedError = class extends Error {
    constructor(message = 'Unauthorized') {
        super(message);
        this.statusCode = 401;
    }
};

global.ForbiddenError = class extends Error {
    constructor(message = 'Forbidden') {
        super(message);
        this.statusCode = 403;
    }
};

global.NotFoundError = class extends Error {
    constructor(message = 'Not Found') {
        super(message);
        this.statusCode = 404;
    }
};

global.InternalServerError = class extends Error {
    constructor(message = 'Internal Server Error') {
        super(message);
        this.statusCode = 500;
    }
};
