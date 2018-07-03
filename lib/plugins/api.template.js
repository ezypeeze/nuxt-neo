import Vue from 'vue';
import ApiHandler from '<%= options.apiHandlerFile %>';
<% if (options.responseMiddlewareFile) { %>
import ResponseMiddleware from '<%= options.responseMiddlewareFile %>';
<% } else { %>
const ResponseMiddleware = null;
<% } %>

/**
 * Runs possible middleware for the response
 *
 * @param result
 * @returns {Function}
 */
function runResponseMiddleware(result) {
    return ResponseMiddleware && ResponseMiddleware(result) || Promise.resolve(result);
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
function generateAPI(controllerMapping, app) {
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
                    app
                ).then(runResponseMiddleware);
            }
        } else if (typeof controllerMapping[key] === 'object') {
            api[key] = generateAPI(controllerMapping[key], app);
        }
    });

    return api;
}

export default ({app, req}) => {
    const $api = process.server ? req._controllersTree : generateAPI(<%= options.controllers %>, app);
    app.$api = $api;
    Vue.prototype.$api = $api;
};
