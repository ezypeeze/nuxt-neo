const fs             = require('fs');
const _SERVICE_TYPES = {};

/**
 * Gets a service, lazy loaded.
 *
 * @param key
 * @returns {*}
 */
function getService(key) {
    if (!this._services) this._services = {};
    if (!_SERVICE_TYPES[key]) {
        throw new Error(`The service "${key}" doesn't exist.`)
    }

    if (!this._services[key]) {
        this._services[key] = new _SERVICE_TYPES[key](this);
    }

    return this._services[key];
}

/**
 * Inject Services getter into request object prototype.
 *
 * @param options
 * @return
 */
function injectServices(options) {
    const servicesDirectory = options.services.directory;
    if (!fs.existsSync(servicesDirectory)) {
        throw new Error(`The services directory doesn't exist (directory: ${servicesDirectory})`);
    }

    // Get all services
    fs.readdirSync(servicesDirectory).forEach(function (file) {
        _SERVICE_TYPES[file.replace('.js', '')] = require(servicesDirectory + '/' + file);
    });

    return function (req, res, next) {
        req.prototype.getService = getService;

        next();
    };
}

module.exports = injectServices;