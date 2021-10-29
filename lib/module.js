import path from 'path';
import { injectAPI, injectRouteControllerMapping } from './server_middleware/api';
import { controllerMappingClientSide } from './utility/controllers';

const DEFAULT_MODULE_OPTIONS = {
    directory: '~/api',
    prefix: '/api',
    bodyParsers: 'json',
    httpErrors: true,
    debug: process.env.NODE_ENV !== 'production',
    noContentStatusOnEmpty: true,
    clientSideApiHandler: '~/api_handler',
    successHandler: null,
    errorHandler: null,
    serverSuccessResponse: function (req, res, options) {
        if (!res.result && options.noContentStatusOnEmpty) {
            return res.status(204).send();
        }

        // Generic response
        return res.status(200).json(res.result);
    },
    serverErrorResponse: function (err, req, res, options) {
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
    serverNotFoundRouteResponse: function (req, res, options) {
        return res.status(404).json({
            message: 'Route not found'
        });
    }
};

export default async function NeoModule(moduleOptions) {
    moduleOptions = Object.assign({}, DEFAULT_MODULE_OPTIONS, moduleOptions, this.options.nuxtNeo);
    moduleOptions.aliasKey = /^[~|@]/g;
    moduleOptions.srcDir = this.options.srcDir;
    moduleOptions.directory = moduleOptions.directory.replace(moduleOptions.aliasKey, moduleOptions.srcDir);

    // Globalize server-side http errors
    moduleOptions.httpErrors && await import('./utility/http_errors');

    // Inject API server middleware
    this.addServerMiddleware(await injectAPI(moduleOptions));

    // Inject Route Controller mapping
    this.addServerMiddleware(await injectRouteControllerMapping(moduleOptions));

    // Inject client-side http global errors
    if (moduleOptions.httpErrors) {
        this.addPlugin({
            src: path.resolve(__dirname, 'plugins', 'http_errors.js'),
            ssr: false
        })
    }

    // Inject api object tree into vue js
    this.addPlugin({
        src: path.resolve(__dirname, 'plugins', 'api.template.js'),
        options: {
            apiHandlerFile: moduleOptions.clientSideApiHandler,
            successHandlerFile: moduleOptions.successHandler,
            errorHandlerFile: moduleOptions.errorHandler,
            controllers: JSON.stringify(await controllerMappingClientSide(moduleOptions.directory)),
            apiConfig: JSON.stringify(moduleOptions)
        }
    });
};
