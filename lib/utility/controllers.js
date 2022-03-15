import fs from 'fs';
import { compile as compilePath } from 'path-to-regexp';

/**
 * Converts a string camelcase to dash case
 *
 * @param v
 * @returns {string}
 */
export function camelcaseToDashcase(v) {
    let ret = '';
    let prevLowercase = false;

    for (const s of v) {
        const isUppercase = s.toUpperCase() === s;
        if (isUppercase && prevLowercase) {
            ret += '-';
        }

        ret += s;
        prevLowercase = !isUppercase;
    }

    return ret.replace(/-+/g, '-').toLowerCase();
};

/**
 * Runs a list of promises, by order sequencially
 *
 * @param promises
 */
function promiseAllSequencial(promises) {
    if (!Array.isArray(promises) || promises.filter(x => typeof x !== 'function').length > 0) {
        throw new Error('First argument need to be an array of functions that return a promise');
    }

    const results = [];
    let count = 0;

    const iterateeFunc = (previousPromise, currentPromise) => {
        return previousPromise
            .then(function (result) {
                if (count++ !== 0) results.push(result);
                return currentPromise(result, results, count);
            });
    };

    return promises
        .concat(() => Promise.resolve())
        .reduce(iterateeFunc, Promise.resolve(false))
        .then(() => results);
}

/**
 * Gets all controller files.
 *
 * @param directory
 * @param [fileList]
 * @returns {Array}
 */
export function getControllerFiles(directory, fileList) {
    const files = fs.readdirSync(directory);
    fileList = fileList || [];
    for (const file of files) {
        const path = directory + '/' + file;
        if (fs.statSync(path).isDirectory()) {
            fileList = getControllerFiles(path, fileList);
        } else {
            fileList.push(path);
        }
    }

    return fileList;
}

/**
 * Gets controller middleware
 *
 * @param ControllerClass
 * @returns {Object}
 */
export function getControllerMiddleware(ControllerClass) {
    const all = [];
    const actions = {};

    for (const key of Object.keys(ControllerClass.ROUTES || {})) {
        const actionMiddleware = ControllerClass.ROUTES[key].middleware;
        if (actionMiddleware && actionMiddleware.length > 0) {
            actions[key] = actionMiddleware;
        }
    }

    for (const middleware of (ControllerClass.MIDDLEWARE || [])) {
        if (Array.isArray(middleware)) {
            /**
             * @deprecated specify action-based middleware inside ROUTES
             */
            if (typeof middleware[0] === 'string') {
                actions[middleware[0]] = middleware.slice(1);
            }
        } else if (typeof middleware === 'function') {
            all.push(middleware);
        }
    }

    return { all, actions };
}

/**
 * Route controller mapping recursive.
 *
 * @param mapping
 * @param parts
 * @param onEmpty
 * @returns {Promise<void>}
 */
async function controllerMappingRecursive(mapping, parts, onEmpty) {
    parts = (Array.isArray(parts) ? parts : []);
    const chunk = parts[0];
    if (chunk) {
        if (parts.length === 1) {
            mapping[chunk] = Object.assign({}, mapping[chunk] || {}, await onEmpty());
            return;
        }

        if (!mapping[chunk]) mapping[chunk] = {};
        await controllerMappingRecursive(mapping[chunk], parts.slice(1), onEmpty);
    }
}

/**
 * Route controller mapping.
 *
 * @param directory
 * @param controllerValue
 * @returns {Promise<Object>}
 */
async function controllerMapping(directory, controllerValue) {
    const mapping = {};
    for (const path of getControllerFiles(directory)) {
        const relativePath = path.replace(directory, '').replace(/\/index|\.js/g, '');
        const routePrefix = relativePath.split('/').map(camelcaseToDashcase).join('/');

        await controllerMappingRecursive(mapping, relativePath.substring(1).split('/'), async function () {
            let ControllerClass = await import(path);
            ControllerClass = ControllerClass && ControllerClass.default || ControllerClass;

            const controllerRoutes = {};
            const routes = ControllerClass.ROUTES || {};

            for (const route of Object.keys(routes)) {
                controllerRoutes[route] = controllerValue(ControllerClass, route, routes[route], routePrefix);
            }

            return controllerRoutes;
        });
    };

    return mapping;
}

/**
 * Middleware handler for express router.
 *
 * @param middleware
 * @returns {Promise<Object[]>}
 */
export async function middlewareHandler(middleware, req) {
    middleware = Array.isArray(middleware) ? middleware : middleware && [middleware] || [];

    return await promiseAllSequencial(middleware.map(fn => () => Promise.resolve(fn(req))));
}

/**
 * Route Controller mapping for client side api plugin.
 *
 * @param directory
 * @returns {Promise<Object>}
 */
export async function controllerMappingClientSide(directory) {
    return await controllerMapping(directory, function (ControllerClass, actionName, { path, verb }, routePrefix) {
        return {
            path: routePrefix + path,
            verb
        };
    });
}

/**
 * Route Controller mapping for server side.
 *
 * @param directory
 * @param req
 * @param options
 * @param resolver
 * @param ctx
 * @returns {Promise<Object>}
 */
export async function controllerMappingServerSide(directory, req, options, resolver, ctx) {
    const apiMiddleware = options.middleware;
    let SuccessHandler = options.successHandler ? await import(resolver.resolveAlias(options.successHandler)) : null;
    let ErrorHandler = options.errorHandler ? await import(resolver.resolveAlias(options.errorHandler)) : null;

    SuccessHandler = SuccessHandler && SuccessHandler.default || SuccessHandler;
    ErrorHandler = ErrorHandler && ErrorHandler.default || ErrorHandler;

    return await controllerMapping(options.directory, function (ControllerClass, actionName, action) {
        const pathCompiler = compilePath(action.path, { encode: encodeURIComponent });
        const controllerMiddleware = getControllerMiddleware(ControllerClass);

        return function ({ params, body, query } = {}) {
            try {
                pathCompiler(params);
            } catch (error) {
                throw new Error(`Error calling the nuxt-neo API (name: ${actionName}, path: ${action.path}): ${error.message}`);
            }

            return middlewareHandler(apiMiddleware, req)
                .then(function () {
                    return middlewareHandler(controllerMiddleware.all, req);
                })
                .then(function () {
                    return middlewareHandler(
                        controllerMiddleware.actions && controllerMiddleware.actions[actionName] || [],
                        req
                    );
                })
                .then(function () {
                    return Promise.resolve(new ControllerClass(req)[actionName]({
                        params: params || {},
                        body: body || {},
                        query: query || {}
                    }));
                })
                .then(function (result) {
                    return SuccessHandler && SuccessHandler(result) || Promise.resolve(result);
                })
                .catch(function (err) {
                    err.ctx = ctx;
                    const result = ErrorHandler && ErrorHandler(err) || Promise.reject(err);
                    delete err.ctx;
                    return result;
                });
        };
    });
}
