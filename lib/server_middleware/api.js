import express from 'express';
import url from 'url';
import expressBodyParser from 'body-parser';
import { DEFAULT_PARSER_OPTIONS } from '../utility/body_parser';
import {
    camelcaseToDashcase,
    getControllerFiles,
    getControllerMiddleware,
    middlewareHandler,
    controllerMappingServerSide
} from '../utility/controllers';

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

        return Promise.resolve(controller[actionName]({
            params: req.params,
            body: req.body,
            query: req.query
        }))
            .then(function (result) {
                res.result = result;
                next();
            })
            .catch(next);
    };
}

/**
 * Creates the routes based on the controller.
 *
 * @param controllerFile
 * @param options
 * @returns {Router}
 */
async function createControllerRouter(controllerFile, options) {
    const router = express.Router();
    let ControllerClass = await import(controllerFile);
    ControllerClass = ControllerClass.default || ControllerClass;
    const routes = ControllerClass.ROUTES || {};

    for (const actionName of Object.keys(routes)) {
        if (ControllerClass.prototype[actionName]) {
            const { path, verb } = routes[actionName];
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
    }

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
        for (const parser of (Array.isArray(options.bodyParsers) ? options.bodyParsers : [options.bodyParsers])) {
            if (typeof parser === 'string' && expressBodyParser[parser]) {
                parsers.push(expressBodyParser[parser](DEFAULT_PARSER_OPTIONS[parser] || {}));
            } else if (typeof parser === 'object' && parser.adapter && expressBodyParser[parser.adapter]) {
                parsers.push(expressBodyParser[parser.adapter](
                    parser.options && Object.assign({}, DEFAULT_PARSER_OPTIONS[parser.adapter] || {}, parser.options) ||
                    DEFAULT_PARSER_OPTIONS[parser.adapter] ||
                    {}
                ));
            } else if (typeof parser === 'function') {
                parsers.push(parser(options));
            }
        }
    }

    return parsers;
}

/**
 * Inject controllers and api routes.
 *
 * @param router
 * @param options
 */
async function injectControllers(router, options) {
    for (const path of getControllerFiles(options.directory)) {
        const relativePath = path.replace(options.directory, '');
        const routePrefix = relativePath.replace(/\/index|\.js/g, '').split('/').map(camelcaseToDashcase).join('/');

        router.use(routePrefix, await createControllerRouter(path, options));
    };
}

/**
 * Injects the API.
 *
 * @param options
 * @returns {Promise<{path: *, handler: *}>}
 */
export async function injectAPI(options) {
    const _app = express();
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

    // Extend router
    if (typeof options.extendRouter === 'function') {
        options.extendRouter(router);
    }

    // Middleware for all API routes
    if (options.middleware) {
        router.use(function (req, res, next) {
            return middlewareHandler(options.middleware, req)
                .then(() => next())
                .catch(next);
        });
    }

    // Inject Controller routes
    await injectControllers(router, options);

    // Success Response handler
    router.use(function (req, res, next) {
        if (req.route) {
            return options.serverSuccessResponse(req, res, options);
        }

        next();
    });

    // Not Found Handler
    router.use(function (req, res, next) {
        if (!req.route) {
            return options.serverNotFoundRouteResponse(req, res, options);
        }

        next();
    });

    // Error Response handler
    router.use(function (err, req, res, next) {
        return options.serverErrorResponse(err, req, res, options);
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
 * @param resolver
 * @returns {Function}
 */
export function injectRouteControllerMapping(options, resolver) {
    return function (req, res, next) {
        req._controllersTree = async function (ctx) {
            return await controllerMappingServerSide(options.directory, req, options, resolver, ctx);
        };

        next();
    };
}
