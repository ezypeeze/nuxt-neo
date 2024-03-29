export default class TestController {
    static ROUTES = {
        getAction: {
            path: '/:id',
            verb: 'GET'
        },
        allAction: {
            path: '/',
            verb: 'GET',
            middleware: [
                function (req) {
                    if (!req.locals) req.locals = {};

                    req.locals.action_middleware = true;
                },
                function (req) {
                    req.locals.action_middleware_2 = true;
                }
            ]
        },
        createAction: {
            path: '/',
            verb: 'POST'
        },
        updateAction: {
            path: '/:id',
            verb: 'PUT'
        },
        removeAction: {
            path: '/:id',
            verb: 'DELETE'
        }
    };

    static MIDDLEWARE = [
        function (req) {
            if (!req.locals) req.locals = {};

            req.locals.controller_middleware = true;
        }
    ];

    constructor(request) {
        this.request = request;
    }

    getAction({ params, query }) {
        return {
            ok: true,
            path: this.request.originalUrl,
            controller_middleware: this.request.locals && this.request.locals.controller_middleware,
            action_middleware: this.request.locals && this.request.locals.action_middleware,
            params,
            query
        };
    }

    allAction({ params, query }) {
        if (query.force_error) {
            throw new Error('Forced error');
        }

        return {
            ok: true,
            path: this.request.originalUrl,
            controller_middleware: this.request.locals && this.request.locals.controller_middleware,
            action_middleware: this.request.locals && this.request.locals.action_middleware,
            action_middleware_2: this.request.locals && this.request.locals.action_middleware_2,
            params,
            query
        };
    }

    createAction({ params, body, query }) {
        if (query.exception && global[query.exception]) {
            throw new global[query.exception](query.message);
        }

        return {
            ok: true,
            path: this.request.originalUrl,
            controller_middleware: this.request.locals && this.request.locals.controller_middleware,
            action_middleware: this.request.locals && this.request.locals.action_middleware,
            params,
            body
        };
    }

    updateAction({ params, body }) {
        return {
            ok: true,
            path: this.request.originalUrl,
            controller_middleware: this.request.locals && this.request.locals.controller_middleware,
            action_middleware: this.request.locals && this.request.locals.action_middleware,
            params,
            body
        };
    }

    removeAction({ params, body }) {
        return {
            ok: true,
            path: this.request.originalUrl,
            controller_middleware: this.request.locals && this.request.locals.controller_middleware,
            action_middleware: this.request.locals && this.request.locals.action_middleware,
            params,
            body
        };
    }
};
