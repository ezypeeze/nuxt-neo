const express           = require('express');
const url               = require('url');
const expressBodyParser = require('body-parser');
const { DEFAULT_PARSER_OPTIONS } = require('../utility/body_parser');
const { getControllerFiles, getControllerMiddleware, middlewareHandler, controllerMappingServerSide } = require('../utility/controllers');

/**
 * Action handler middleware.
 *
 * @param ControllerClass
 * @param actionName
 * @param options
 * @returns {Function}
 */
function actionHandler(ControllerClass, actionName, options) {
    return function (req, res, next) {
        const controller = new ControllerClass(req);

        return Promise.resolve(controller[actionName]({params: req.params, body: req.body, query: req.query}))
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
 * @returns {Router}
 */
function createControllerRouter(controllerFile, options) {
    const router          = express.Router();
    const ControllerClass = require(controllerFile);
    const routes          = ControllerClass.ROUTES || {};

    Object.keys(routes).forEach(function (actionName) {
        if (ControllerClass.prototype[actionName]) {
            const {path, verb}         = routes[actionName];
            const controllerMiddleware = getControllerMiddleware(ControllerClass);

            router[verb.toLowerCase()](
                path,
                function (req, res, next) {
                    return middlewareHandler(controllerMiddleware.all, req)
                        .then(() => middlewareHandler(controllerMiddleware.actions && controllerMiddleware.actions[actionName] || [], req))
                        .then(() => next())
                        .catch(next);
                },
                actionHandler(ControllerClass, actionName, options) // Handle controller action method.
            );
        }
    });

    return router;
}

/**
 * Injects body parsers to the API.
 *
 * @param options
 */
function injectBodyParsers(options) {
    const parsers = [];
    if (options.bodyParsers) {
        (Array.isArray(options.bodyParsers) ? options.bodyParsers : [options.bodyParsers]).forEach(function (parser) {
            if (typeof parser === 'string' && expressBodyParser.hasOwnProperty(parser)) {
                parsers.push(expressBodyParser[parser](DEFAULT_PARSER_OPTIONS[parser] || {}));
            } else if (typeof parser === 'object' && parser.adapter && expressBodyParser.hasOwnProperty(parser.adapter)) {
                parsers.push(expressBodyParser[parser.adapter](
                    parser.options && Object.assign({}, DEFAULT_PARSER_OPTIONS[parser.adapter] || {}, parser.options) ||
                    DEFAULT_PARSER_OPTIONS[parser.adapter] ||
                    {}
                ));
            } else if (typeof parser === 'function') {
                parsers.push(parser(options));
            }
        });
    }

    return parsers;
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

    // Request body parsers
    router.use(...(injectBodyParsers(options)));

    // Middleware for all API routes
    if (options.middleware) {
        router.use(function (req, res, next) {
            return middlewareHandler(options.middleware, req)
                .then(() => next())
                .catch(next);
        });
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
        try {
            Promise.resolve(options.errorHandler(err, req))
                .then(function (_err) {
                    return options.errorResponse(_err || err, req, res, options);
                });
        } catch (_err) {
            options.errorResponse(_err, req, res, options);
        }
    });

    return {
        path: options.prefix,
        handler: router
    };
}

/**
 * Injects Route Controller mapper.
 *
 * @param options
 * @returns {Function}
 */
function injectRouteControllerMapping(options) {
    return function (req, res, next) {
        req._controllersTree = controllerMappingServerSide(options.directory, req, options);

        next();
    }
}

module.exports = {
    injectAPI,
    injectRouteControllerMapping
};
