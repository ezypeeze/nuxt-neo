import Vue from 'vue';
import ApiHandler from '<%= options.apiHandlerFile %>';

<% if (options.successHandlerFile) { %>
import SuccessHandler from '<%= options.successHandlerFile %>';
<% } else { %>
const SuccessHandler = null;
<% } %>

<% if (options.errorHandlerFile) { %>
import ErrorHandler from '<%= options.errorHandlerFile %>';
<% } else { %>
    const ErrorHandler = null;
<% } %>

/**
 * Runs possible success handler
 *
 * @param result
 * @returns {Function}
 */
function runSuccessHandler(result) {
    return SuccessHandler && SuccessHandler(result) || Promise.resolve(result);
}

/**
 * Runs possible error handler
 *
 * @param error
 * @returns {Function}
 */
function runErrorHandler(error) {
    return ErrorHandler && ErrorHandler(error) || Promise.reject(error);
}

/**
 * Inject given params into path (express-like)
 *
 * @param path
 * @param params
 * @return string
 */
function injectParamsIntoPath(path, params) {
    if (params) {
        Object.keys(params).forEach(function (key) {
            path = path.replace(new RegExp(':' + key, 'g'), params[key]);
        });
    }

    return path;
}

/**
 * Generates the API tree for the client side.
 *
 * @param controllerMapping
 * @return Object
 */
function generateAPI(controllerMapping, ctx) {
    const api = {};
    Object.keys(controllerMapping).forEach(function (key) {
        const context = controllerMapping[key];
        if (context && context.path && context.verb) {
            api[key] = function ({params, ...values} = {}) {
                return ApiHandler(
                    injectParamsIntoPath(
                        context.path[context.path.length - 1] === '/' ?
                            context.path.slice(0, context.path.length - 1) :
                            context.path,
                        params
					),
                    context.verb,
                    values || {},
                    <%= options.apiConfig %>,
                    ctx
                )
                    .then(runSuccessHandler)
                    .catch(err => {
                        err.ctx = ctx;

                        return runErrorHandler(err);
                    });
            }
        } else if (typeof controllerMapping[key] === 'object') {
            api[key] = generateAPI(controllerMapping[key], ctx);
        }
    });

    return api;
}

export default (ctx) => {
    const {app, req} = ctx;
    const $api = process.server ? req._controllersTree(ctx) : generateAPI(<%= options.controllers %>, ctx);
    app.$api = $api;
    Vue.prototype.$api = $api;
};
