class TestController {

    constructor(request) {
        this.request = request;
    }

    getAction({params, query}) {
        return {
            ok: true,
            path: this.request.originalUrl,
            controller_middleware: this.request.locals && this.request.locals.controller_middleware,
            action_middleware: this.request.locals && this.request.locals.action_middleware,
            params,
            query,
        }
    }

    allAction({params, query}) {
        if (query.force_error) {
            throw new Error('Forced error');
        }

        return {
            ok: true,
            path: this.request.originalUrl,
            controller_middleware: this.request.locals && this.request.locals.controller_middleware,
            action_middleware: this.request.locals && this.request.locals.action_middleware,
            params,
            query,
        }
    }

    createAction({params, body, query}) {
        if (query.exception && global[query.exception]) {
            throw new global[query.exception](query.message);
        }

        return {
            ok: true,
            path: this.request.originalUrl,
            controller_middleware: this.request.locals && this.request.locals.controller_middleware,
            action_middleware: this.request.locals && this.request.locals.action_middleware,
            params,
            body,
        }
    }

    updateAction({params, body}) {
        return {
            ok: true,
            path: this.request.originalUrl,
            controller_middleware: this.request.locals && this.request.locals.controller_middleware,
            action_middleware: this.request.locals && this.request.locals.action_middleware,
            params,
            body,
        }
    }

    removeAction({params, body}) {
        return {
            ok: true,
            path: this.request.originalUrl,
            controller_middleware: this.request.locals && this.request.locals.controller_middleware,
            action_middleware: this.request.locals && this.request.locals.action_middleware,
            params,
            body,
        }
    }

}

TestController.ROUTES = {
    getAction: {
        path: '/:id',
        verb: 'GET'
    },
    allAction: {
        path: '/',
        verb: 'GET'
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

TestController.MIDDLEWARE = [
    function (req) {
        if (!req.locals) req.locals = {};

        req.locals.controller_middleware = true;
    },
    ['allAction', function (req)  {
        if (!req.locals) req.locals = {};

        req.locals.action_middleware = true;
    }]
];

module.exports = TestController;
