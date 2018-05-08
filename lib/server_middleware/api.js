const express                                                               = require('express');
const {getControllerFiles, getControllerMiddleware, controllerMapping} = require('../utility/controllers');

/**
 * Action handler middleware.
 *
 * @param ControllerClass
 * @param methodName
 *
 * @returns {Function}
 */
function actionHandler(ControllerClass, methodName) {
    return function (req, res, next) {
        const controller = new ControllerClass(req);
        // Route was not found
        if (!controller[methodName]) {
            if (typeof NotFoundError !== 'undefined') {
                return next(new NotFoundError);
            }

            return res.status(404).send('Not found');
        }

        try {
            return Promise.resolve(controller[methodName](req.params, {body: req.body, query: req.query}))
                .then(function (result) {
                    res.result = options.successHandler(result, req);
                    next();
                })
                .catch(next);
        } catch (err) {
            next(err);
        }
    }
}

/**
 * Creates the routes based on the controller.
 *
 * @param routePath
 * @param controllerFile
 * @param options
 */
function createControllerRouter(routePath, controllerFile, options) {
    const router = express.Router();
    const ControllerClass = require(controllerFile);
    const routes = ControllerClass.ROUTES || {};

    Object.keys(routes).forEach(function (methodName) {
        const {path, verb}          = routes[methodName];
        const controllerMiddleware  = getControllerMiddleware(ControllerClass);

        router[verb.toLowerCase()](
            routePath + path,
            ...controllerMiddleware.all, // Controller middleware for all actions
            ...(controllerMiddleware[methodName] || []), // Action only middleware
            actionHandler(ControllerClass, methodName) // Handle controller action method.
        );
    });
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
        const routePrefix = relativePath.replace(/\/index|\.js/g, '');

        router.use(routePrefix, createControllerRouter(routePrefix, path, options));
    });
}

/**
 * Injects the API.
 *
 * @param options
 * @returns {{path: *, handler: *}}
 */
function injectAPI(options) {
    const router = express.Router();

    // Express-like req and res objects
    router.use(function (req, res, next) {
        Object.setPrototypeOf(req, router.request);
        Object.setPrototypeOf(res, router.response);
        req.res = res;
        res.req = req;
        next();
    });

    // Middleware for all API routes
    if (options.middleware) {
        options.middleware.forEach(function (middleware) {
            router.use(middleware);
        });
    }

    // Inject Controller routes
    injectControllers(router, options);

    // Success Response handler
    router.use(function (req, res) {
        options.successResponse(req, res, options);
    });

    // Error Response handler
    router.use(function (err, req, res, next) {
        options.errorResponse(err, req, res, options);
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
        req.routeControllerMap = function () {
            return controllerMapping(options.directory, function (ControllerClass, actionName) {
                return function (params, body, query) {
                    try {
                        return Promise.resolve(new ControllerClass(req)[actionName](params, body, query))
                            .then(function (result) {
                                return options.successHandler(result);
                            })
                            .catch(function (err) {
                                return options.errorHandler(err);
                            });
                    } catch (err) {
                        options.errorHandler(err);
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