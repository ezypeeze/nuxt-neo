const Controller = require('../../../../lib/Controller');

class UserController extends Controller {

    allAction({params, query}) {
        return {
            ok: true,
            path: this.request.path,
            params,
            query,
        }
    }

    createAction({params, body}) {
        return {
            ok: true,
            path: this.request.path,
            params,
            body,
        }
    }

    updateAction({params, body}) {
        return {
            ok: true,
            path: this.request.path,
            params,
            body,
        }
    }

    removeAction({params, body}) {
        return {
            ok: true,
            path: this.request.path,
            params,
            body,
        }
    }

}

UserController.ROUTES = {
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

UserController.MIDDLEWARE = [];

module.exports = UserController;