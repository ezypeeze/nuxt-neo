/**
 * Injects configuration into request object.
 *
 * @param options
 * @returns {Function}
 */
function injectConfiguration(options) {
    // Sets environment variable for 'config' node library.
    process.env.NODE_CONFIG_DIR = options.directory;
    const config                = require('config');

    return function (req, res, next) {
        req.config = config;
        next();
    }
}

module.exports = injectConfiguration;