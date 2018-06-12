const users = [];

class UserController {

    constructor(request) {
        this.request = request;
    }

    async allAction({params, query}) {
        return {
            ok: true,
            path: this.request.originalUrl,
            params,
            query,
            users
        }
    }

    async getAction({params, query}) {
        return {
            ok: true,
            path: this.request.originalUrl,
            params,
            query,
            user: users.filter(user => user.id === params.id)
        }
    }

    createAction({params, body}) {
        users.push(Object.assign({}, body, {id: users.length + 1}));

        return {
            ok: true,
            path: this.request.originalUrl,
            params,
            body,
            user: users[users.length - 1]
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

UserController.ROUTES = {
    allAction: {
        path: '/',
        verb: 'GET'
    },
    getAction: {
        path: '/:id',
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
