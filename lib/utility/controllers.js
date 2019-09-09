const fs = require('fs');

/**
 * Converts a string camelcase to dash case
 *
 * @param v
 * @returns {string}
 */
function camelcaseToDashcase(v) {
    let ret = '';
    let prevLowercase = false;

    for (let s of v) {
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
 * Gets all controller files.
 *
 * @param directory
 * @param fileList
 * @returns {Array}
 */
function getControllerFiles(directory, fileList) {
    const files = fs.readdirSync(directory);
    fileList    = fileList || [];
    files.forEach(function (file) {
        const path = directory + '/' + file;
        if (fs.statSync(path).isDirectory()) {
            fileList = getControllerFiles(path, fileList);
        } else {
            fileList.push(path);
        }
    });

    return fileList;
}

/**
 * Gets controller middleware
 *
 * @param ControllerClass
 * @returns {Object}
 */
function getControllerMiddleware(ControllerClass) {
    const all     = [];
    const actions = {};
    (ControllerClass.MIDDLEWARE || []).forEach(function (middleware) {
        if (Array.isArray(middleware)) {
            if (typeof middleware[0] === 'string') {
                actions[middleware[0]] = middleware.slice(1);
            }
        } else if (typeof middleware === 'function') {
            all.push(middleware);
        }
    });

    return { all, actions };
}

/**
 * Route controller mapping recursive.
 *
 * @param mapping
 * @param parts
 * @param onEmpty
 * @returns {void}
 */
function controllerMappingRecursive(mapping, parts, onEmpty) {
    parts       = (Array.isArray(parts) ? parts : []);
    const chunk = parts[0];
    if (chunk) {
        if (parts.length === 1) {
            mapping[chunk] = Object.assign({}, mapping[chunk] || {}, onEmpty());
            return;
        }

        if (!mapping[chunk]) mapping[chunk] = {};
        controllerMappingRecursive(mapping[chunk], parts.slice(1), onEmpty);
    }
}

/**
 * Route controller mapping.
 *
 * @param directory
 * @param controllerValue
 * @returns {Object}
 */
function controllerMapping(directory, controllerValue) {
    let mapping = {};
    getControllerFiles(directory).forEach(function (path) {
        const relativePath = path.replace(directory, '').replace(/\/index|\.js/g, '');
        const routePrefix  = relativePath.split('/').map(camelcaseToDashcase).join('/');

        controllerMappingRecursive(mapping, relativePath.substring(1).split('/'), function () {
            const controllerRoutes = {};
            const ControllerClass  = require(path);
            const routes           = ControllerClass.ROUTES || {};

            Object.keys(routes).forEach(function (route) {
                controllerRoutes[route] = controllerValue(ControllerClass, route, routes[route], routePrefix);
            });

            return controllerRoutes;
        });
    });

    return mapping;
}

/**
 * Middleware handler for express router.
 *
 * @param middleware
 * @returns {Object}
 */
function middlewareHandler(middleware, req) {
    middleware = Array.isArray(middleware) ? middleware : middleware && [middleware] || [];
    return Promise.all(middleware.map(function (fn) {
        return Promise.resolve(fn(req));
    }));
}

/**
 * Route Controller mapping for client side api plugin.
 *
 * @param directory
 * @returns {Object}
 */
function controllerMappingClientSide(directory) {
    return controllerMapping(directory, function (ControllerClass, actionName, { path, verb }, routePrefix) {
        return {
            path: routePrefix + path,
            verb
        }
    });
}

/**
 * Route Controller mapping for server side.
 *
 * @param directory
 * @param req
 * @param options
 * @param ctx
 * @returns {Object}
 */
function controllerMappingServerSide(directory, req, options, ctx) {
    const apiMiddleware = options.middleware;
    let SuccessHandler = options.successHandler
        ? require(options.successHandler.replace(options.aliasKey, options.srcDir))
        : null;
    let ErrorHandler = options.errorHandler
        ? require(options.errorHandler.replace(options.aliasKey, options.srcDir))
        : null;

    SuccessHandler = SuccessHandler && SuccessHandler.default
        ? SuccessHandler.default
        : SuccessHandler;

    ErrorHandler = ErrorHandler && ErrorHandler.default
        ? ErrorHandler.default
        : ErrorHandler;

    return controllerMapping(options.directory, function (ControllerClass, actionName) {
        const controllerMiddleware = getControllerMiddleware(ControllerClass);

        return function ({ params, body, query } = {}) {
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
                    }))
                })
                .then(function (result) {
                    return SuccessHandler && SuccessHandler(result) || Promise.resolve(result);
                })
                .catch(function (err) {
                    err.ctx = ctx;
                    return ErrorHandler && ErrorHandler(err) || Promise.reject(err);
                });
        }
    });
}

module.exports = {
    camelcaseToDashcase,
    getControllerFiles,
    getControllerMiddleware,
    middlewareHandler,
    controllerMappingClientSide,
    controllerMappingServerSide
};
