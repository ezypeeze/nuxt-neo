const path = require('path');

const DEFAULT_MODULE_OPTIONS = {
    directory: '~/api',
    prefix: '/api',
    bodyParsers: 'json',
    httpErrors: true,
    debug: process.env.NODE_ENV !== 'production',
    noContentStatusOnEmpty: true,
    clientSideApiHandler: '~/api_handler',
    responseMiddleware: null,
    successHandler: function (result) {
        return result;
    },
    successResponse: function (req, res, options) {
        if (!res.result && options.noContentStatusOnEmpty) {
            return res.status(204).send();
        }

        return res.status(200).json(res.result);
    },
    errorHandler: function (err) {
        throw err;
    },
    errorResponse: function (err, req, res, options) {
        if (err && err.statusCode) {
            return res.status(err.statusCode).json({
                message: err.message,
                errors: err.errors
            });
        }

        // If in debug mode, show the error message and stack trace.
        if (options.debug) {
            return res.status(500).json({
                message: err.message,
                trace: err.stack.split('\n')
            });
        }

        return res.status(500).json({
            message: 'An internal error has occurred'
        });
    },
    notFoundRouteResponse: function (req, res) {
        return res.status(404).json({message: 'Route not found'});
    }
};

module.exports = function NeoModule(moduleOptions) {
    moduleOptions = Object.assign({}, DEFAULT_MODULE_OPTIONS, moduleOptions);
    moduleOptions.aliasKey = /^[~|@]/g;
    moduleOptions.srcDir   = this.options.srcDir;
    moduleOptions.directory = moduleOptions.directory.replace(moduleOptions.aliasKey, moduleOptions.srcDir);

    // Globalize http errors exceptions
    moduleOptions.httpErrors && require('./utility/http_errors');

    const {injectAPI, injectRouteControllerMapping} = require('./server_middleware/api');
    const {controllerMappingClientSide}             = require('./utility/controllers');

    // Inject API server middleware
    this.addServerMiddleware(injectAPI(moduleOptions));

    // Inject Route Controller mapping
    this.addServerMiddleware(injectRouteControllerMapping(moduleOptions));

    // Inject api object tree into vue js
    this.addPlugin({
        src: path.resolve(__dirname, 'plugins', 'api.template.js'),
        options: {
            apiHandlerFile: moduleOptions.clientSideApiHandler,
            responseMiddlewareFile: moduleOptions.responseMiddleware,
            controllers: JSON.stringify(controllerMappingClientSide(moduleOptions.directory)),
            apiConfig: JSON.stringify(moduleOptions)
        }
    });
};