const fs = require("fs");

/**
 * Gets all controller files.
 *
 * @param directory
 * @param fileList
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
 * @return Object
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
 * Route controller mapping
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
 * Route Controller mapping for client side api plugin.
 *
 * @param directory
 * @return Object
 */
function controllerMappingClientSide(directory) {
    return controllerMapping(directory, function (ControllerClass, actionName, {path, verb}, routePrefix) {
        return {
            path: routePrefix + path,
            verb
        }
    });
}

module.exports = {
    getControllerFiles,
    getControllerMiddleware,
    controllerMapping,
    controllerMappingClientSide
};