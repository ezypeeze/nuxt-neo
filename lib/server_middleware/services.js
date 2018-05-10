const fs             = require('fs');
const _SERVICE_TYPES = {};

/**
 * Inject Services getter into request object prototype.
 *
 * @param options
 * @return
 */
function injectServices(options) {
    const servicesDirectory = options.directory;
    if (!fs.existsSync(servicesDirectory)) {
        throw new Error(`The services directory doesn't exist (directory: ${servicesDirectory})`);
    }

    // Get all services
    fs.readdirSync(servicesDirectory).forEach(function (file) {
        _SERVICE_TYPES[file.replace('.js', '')] = require(servicesDirectory + '/' + file);
    });

    return function (req, res, next) {
        req.getService = function (key) {
            if (!req._services) req._services = {};
            if (!_SERVICE_TYPES[key]) {
                throw new Error(`The service "${key}" doesn't exist.`)
            }

            if (!req._services[key]) {
                req._services[key] = new _SERVICE_TYPES[key](req);
            }

            return req._services[key];
        };

        next();
    };
}

module.exports = injectServices;