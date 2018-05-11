const Controller = require('../../lib/Controller');

class TestController extends Controller {

    getAction({params, query}) {
        return {
            ok: true,
            path: this.request.originalUrl,
            params,
            query,
        }
    }

    allAction({params, query}) {
        return {
            ok: true,
            path: this.request.originalUrl,
            params,
            query,
        }
    }

    createAction({params, body}) {
        return {
            ok: true,
            path: this.request.originalUrl,
            params,
            body,
        }
    }

    updateAction({params, body}) {
        return {
            ok: true,
            path: this.request.originalUrl,
            params,
            body,
        }
    }

    removeAction({params, body}) {
        return {
            ok: true,
            path: this.request.originalUrl,
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

TestController.MIDDLEWARE = [];

module.exports = TestController;
