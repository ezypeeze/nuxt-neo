window.BadRequestError = class extends Error {
    constructor(message = 'Bad Request', errors) {
        super(message);
        this.errors = errors;
        this.statusCode = 400;
        this.httpError = true;
    }
};

window.UnauthorizedError = class extends Error {
    constructor(message = 'Unauthorized') {
        super(message);
        this.statusCode = 401;
        this.httpError = true;
    }
};

window.ForbiddenError = class extends Error {
    constructor(message = 'Forbidden') {
        super(message);
        this.statusCode = 403;
        this.httpError = true;
    }
};

window.NotFoundError = class extends Error {
    constructor(message = 'Not Found') {
        super(message);
        this.statusCode = 404;
        this.httpError = true;
    }
};

window.InternalServerError = class extends Error {
    constructor(message = 'Internal Server Error') {
        super(message);
        this.statusCode = 500;
        this.httpError = true;
    }
};
