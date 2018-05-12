const path = require('path');
const _    = require('lodash/fp/object');

const DEFAULT_MODULE_OPTIONS = {
    api: {
        directory: '~/api',
        prefix: '/api',
        httpErrors: true,
        debug: process.env.NODE_ENV !== 'production',
        noContentStatusOnEmpty: true,
        clientSideApiHandler: '~/api_handler',
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
                    trace: err.stack.split("\n")
                });
            }

            return res.status(500).json({
                message: 'An internal error has occurred'
            });
        },
        notFoundRouteResponse: function (req, res) {
            return res.status(404).json({message: 'Route not found'});
        }
    },
    services: {
        directory: '~/services'
    }
};

module.exports = function NeoModule(moduleOptions) {
    moduleOptions                                       = _.merge(DEFAULT_MODULE_OPTIONS, moduleOptions);
    const {api, services, configuration} = moduleOptions;

    // Inject Configuration server middleware
    if (configuration) {
        this.addServerMiddleware(require('./server_middleware/configuration')(configuration));
    }

    // Inject Services server middleware
    if (services) {
        this.addServerMiddleware(require('./server_middleware/services')(services));
    }

    // Inject API server middleware
    if (api) {
        // Globalize http errors exceptions
        api.httpErrors && require('./utility/http_errors');

        const {injectAPI, injectRouteControllerMapping} = require('./server_middleware/api');
        const {controllerMappingClientSide}             = require('./utility/controllers');
        this.addServerMiddleware(injectAPI(api));
        this.addServerMiddleware(injectRouteControllerMapping(api));

        this.addPlugin({
            src: path.resolve(__dirname, 'plugins', 'api.js'),
            options: {
                apiHandlerFile: api.clientSideApiHandler,
                controllers: JSON.stringify(controllerMappingClientSide(api.directory)),
                apiConfig: JSON.stringify({
                    prefix: api.prefix
                })
            }
        })
    }

    /**
     * TODO: EXPRESS INTEGRATION (DONE)
     * TODO: SERVICE CLASS (DONE)
     * TODO: CONTROLLER CLASS (DONE)
     * TODO: PROVIDER BOOTING (DONE)
     * TODO: HTTP ERRORS EXCEPTIONS (DONE)
     * TODO: MIDDLEWARE FOR ALL API, CONTROLLER AND ACTION. (DONE)
     * TODO: PLUGIN TO INJECT SERVICES
     * TODO: GLOBAL FUNCTIONS FOR ASYNC DATA AND FETCH - IF BROWSER: INJECT INTO WINDOW OBJECT, IF SERVER: global func()
     */

};
