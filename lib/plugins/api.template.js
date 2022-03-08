import Vue from 'vue';
import { compile as compilePath }  from '~path-to-regexp';
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
 * @param {import('@nuxt/types').Context} ctx
 * @return Object
 */
function generateAPI(controllerMapping, ctx) {
    const api = {};
    for (const key of Object.keys(controllerMapping)) {
        const context = controllerMapping[key];
        if (context && context.path && context.verb) {
            const pathCompiler = compilePath(context.path, { encode: encodeURIComponent });
            api[key] = function ({params, ...values} = {}) {
                let compiledPath;
                try {
                    compiledPath = pathCompiler(params);
                } catch (error) {
                    throw new Error(`Error calling the nuxt-neo API (name: ${key}, path: ${context.path}): ${error.message}`);
                }
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
    const $api = process.server ? await ctx.req._controllersTree(ctx) : generateAPI(<%= options.controllers %>, ctx);
    inject('api', $api);
};
