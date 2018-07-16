const fs = require('fs');

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

    return {all, actions};
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
        const relativePath = path.replace(directory, '');
        const routePrefix  = relativePath.replace(/\/index|\.js/g, '');
        controllerMappingRecursive(mapping, routePrefix.substring(1).split('/'), function () {
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
    return controllerMapping(directory, function (ControllerClass, actionName, {path, verb}, routePrefix) {
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
 * @returns {Object}
 */
function controllerMappingServerSide(directory, req, options) {
    const apiMiddleware = options.middleware;
    let ResponseMiddleware = options.responseMiddleware
        ? require(options.responseMiddleware.replace(options.aliasKey, options.srcDir))
        : null;

    ResponseMiddleware = ResponseMiddleware && ResponseMiddleware.default
        ? ResponseMiddleware.default
        : ResponseMiddleware;

    return controllerMapping(options.directory, function (ControllerClass, actionName) {
        const controllerMiddleware = getControllerMiddleware(ControllerClass);

        return function ({params, body, query} = {}) {
            try {
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
                        return options.successHandler(result);
                    })
                    .then(function (result) {
                        return ResponseMiddleware && ResponseMiddleware(result) || Promise.resolve(result);
                    })
                    .catch(function (err) {
                        return options.errorHandler(err, req);
                    });
            } catch (err) {
                return options.errorHandler(err, req);
            }
        }
    });
}

module.exports = {
    getControllerFiles,
    getControllerMiddleware,
    middlewareHandler,
    controllerMappingClientSide,
    controllerMappingServerSide
};
