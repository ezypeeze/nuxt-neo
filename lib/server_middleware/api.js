const express                                                          = require('express');
const url                                                              = require('url');
const {getControllerFiles, getControllerMiddleware, controllerMapping} = require('../utility/controllers');

/**
 * Action handler middleware.
 *
 * @param ControllerClass
 * @param methodName
 * @param options
 *
 * @returns {Function}
 */
function actionHandler(ControllerClass, methodName, options) {
    return function (req, res, next) {
        const controller = new ControllerClass(req);

        return Promise.resolve(controller[methodName]({params: req.params, body: req.body, query: req.query}))
            .then(function (result) {
                res.result = options.successHandler(result, req);
                next();
            })
            .catch(next);
    }
}

/**
 * Creates the routes based on the controller.
 *
 * @param controllerFile
 * @param options
 */
function createControllerRouter(controllerFile, options) {
    const router          = express.Router();
    const ControllerClass = require(controllerFile);
    const routes          = ControllerClass.ROUTES || {};

    Object.keys(routes).forEach(function (methodName) {
        const {path, verb}         = routes[methodName];
        const controllerMiddleware = getControllerMiddleware(ControllerClass);

        if (ControllerClass.prototype[methodName]) {
            router[verb.toLowerCase()](
                path,
                ...controllerMiddleware.all, // Controller middleware for all actions
                ...(controllerMiddleware.actions && controllerMiddleware.actions[methodName] || []), // Action only middleware
                actionHandler(ControllerClass, methodName, options) // Handle controller action method.
            );
        }
    });

    return router;
}

/**
 * Inject controllers and api routes.
 *
 * @param router
 * @param options
 */
function injectControllers(router, options) {
    getControllerFiles(options.directory).forEach(function (path) {
        const relativePath = path.replace(options.directory, '');
        const routePrefix  = relativePath.replace(/\/index|\.js/g, '');

        router.use(routePrefix, createControllerRouter(path, options));
    });
}

/**
 * Injects the API.
 *
 * @param options
 * @returns {{path: *, handler: *}}
 */
function injectAPI(options) {
    const _app   = express();
    const router = express.Router();

    // Express-like req and res objects
    router.use(function (req, res, next) {
        Object.setPrototypeOf(req, _app.request);
        Object.setPrototypeOf(res, _app.response);
        req.res = res;
        res.req = req;

        req.query = req.query || url.parse(req.url, true).query || {};

        next();
    });

    // Middleware for all API routes
    if (options.middleware) {
        router.use(...(Array.isArray(options.middleware) ? options.middleware : [options.middleware]));
    }

    // Inject Controller routes
    injectControllers(router, options);

    // Success Response handler
    router.use(function (req, res, next) {
        if (req.route) {
            return options.successResponse(req, res, options);
        }

        next();
    });

    // Not Found Handler
    router.use(function (req, res, next) {
        if (!req.route) {
            return options.notFoundRouteResponse(req, res);
        }

        next();
    });

    // Error Response handler
    router.use(function (err, req, res, next) {
        return Promise.resolve(options.errorHandler(err, req))
            .then(_err => options.errorResponse(_err || err, req, res, options))
            .catch(_err => options.errorResponse(_err, req, res, options))
    });

    return {
        path: options.prefix,
        handler: router
    };
}

/**
 * Injects Route Controller mapper.
 * @param options
 * @returns {Function}
 */
function injectRouteControllerMapping(options) {
    return function (req, res, next) {
        req.generateControllersTree = function () {
            return controllerMapping(options.directory, function (ControllerClass, actionName) {
                return function (params, body, query) {
                    try {
                        return Promise.resolve(new ControllerClass(req)[actionName]({
                            params: params || {},
                            body: body || {},
                            query: query || {}
                        }))
                            .then(function (result) {
                                return options.successHandler(result);
                            })
                            .catch(function (err) {
                                return options.errorHandler(err, req);
                            });
                    } catch (err) {
                        return options.errorHandler(err, req);
                    }
                }
            });
        };

        next();
    }
}

module.exports = {
    injectAPI,
    injectRouteControllerMapping
};
