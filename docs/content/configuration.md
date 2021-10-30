# Configuration #

The default options are:
```js
{
    // api folder tree directory -- required
    directory: __dirname + '/api',

    // api prefix path
    prefix: '/api',

    // Request body parser (using expressjs/body-parser: https://github.com/expressjs/body-parser).
    // String | Array<String> | Object<{adapter: String, options: Object}> |
    // Array<Object<{adapter: String, options: Object}>>
    bodyParsers: 'json',

    // globalize http error classes (BadRequestError, NotFoundError, ...)
    httpErrors: true,

     // debug mode - detailed internal server errors response, with stack, etc...
    debug: process.env.NODE_ENV !== 'production',

    // If controller action return is null/empty, return 204 No Content
    noContentStatusOnEmpty: true,

    // Allows you to extend express router before going to request middleware
    extendRouter: null,

    // Middleware handlers for all your api.
    middleware: [],

    // Client side http request handler -- required
    clientSideApiHandler: '~/api_handler',

    // Universal success handler (will run both on client side and server side $api calls) -- optional
    successHandler: null,

    // Universal error handler (will run both on client side and server side $api calls) -- optional
    errorHandler: null,

    // Success Response handler - will decide how the data will be sent (as json, xml, etc..)
    serverSuccessResponse: function (req, res, options) {
        if (!res.result && options.noContentStatusOnEmpty) {
            return res.status(204).send();
        }

        return res.status(200).json(res.result);
    },

    // Error Response handler - will decide how the error will be sent to the client
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

    // In case the route wasn't found,  will decide what to send to the client
    serverNotFoundRouteResponse: function (req, res) {
        return res.status(404).json({message: 'Route not found'});
    }
}
```
