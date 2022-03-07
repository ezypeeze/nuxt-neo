import Vue from 'vue';
import { compile as compilePath }  from 'path-to-regexp';
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
 * Generates the API tree for the client side.
 *
 * @param controllerMapping
 * @return Object
 */
function generateAPI(controllerMapping, ctx) {
    const api = {};
    for (const key of Object.keys(controllerMapping)) {
        const context = controllerMapping[key];
        if (context && context.path && context.verb) {
            const path = context.path.replace(/\/$/, '');
            const pathCompiler = compilePath(path, { encode: encodeURIComponent });
            api[key] = function ({params, ...values} = {}) {
                const compiledPath = pathCompiler(params)
                return ApiHandler(
                    compiledPath,
                    context.verb,
                    values || {},
                    <%= options.apiConfig %>,
                    ctx
                )
                    .then(runSuccessHandler)
                    .catch(err => {
                        err.ctx = ctx;
                        const result = runErrorHandler(err);
                        delete err.ctx;
                        return result;
                    });
            }
        } else if (typeof controllerMapping[key] === 'object') {
            api[key] = generateAPI(controllerMapping[key], ctx);
        }
    }

    return api;
}

export default async (ctx, inject) => {
    const {app, req} = ctx;
    const $api = process.server ? await req._controllersTree(ctx) : generateAPI(<%= options.controllers %>, ctx);
    inject('api', $api);
};
