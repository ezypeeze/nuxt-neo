const fs             = require('fs');
const _ADAPTER_TYPES = {};

/**
 * Inject data providers into request object prototype.
 *
 * @param options
 */
function injectDataProviders(options) {
    const dataProvidersDirectory = options.directory;
    if (!fs.existsSync(dataProvidersDirectory)) {
        throw new Error(`The data provider adapters directory doesn't exist (directory: ${dataProvidersDirectory})`);
    }

    // Get all data provider adapters
    fs.readdirSync(dataProvidersDirectory).forEach(function (file) {
        _ADAPTER_TYPES[file.replace('.js', '')] = require(dataProvidersDirectory + '/' + file);
    });

    return function (req, res, next) {
        req.prototype.getDataProvider = function (key) {
            const connectors = options.connectors || {};

            const [adapterType, adapterOptions] = connectors[key] || [];
            if (!adapterType) {
                throw new Error(`The configuration for the data provider connector "${key}" does not exist.`);
            }

            if (!_ADAPTER_TYPES[adapterType]) {
                throw new Error(`The adapter type "${adapterType} doesn't exist.`);
            }

            return _ADAPTER_TYPES[adapterType](this, adapterOptions || {});
        };

        next();
    };
}

module.exports = injectDataProviders;