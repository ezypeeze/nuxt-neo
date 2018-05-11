import Vue from 'vue';
import ApiHandler from '<%= options.apiHandlerFile %>';

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
function generateAPI(controllerMapping) {
    const api = {};
    Object.keys(controllerMapping).forEach(function (key) {
        const context = controllerMapping[key];
        if (context && context.path && context.verb) {
            api[key] = function (params, values) {
                return ApiHandler(
                    injectParamsIntoPath(
                        context.path[context.path.length - 1] === '/' ?
                            context.path.slice(0, context.path.length - 1) :
                            context.path,
                        params),
                    context.verb, values || {},
                    <%= options.apiConfig %>
                );
            }
        } else if (typeof controllerMapping[key] === 'object') {
            api[key] = generateAPI(controllerMapping[key]);
        }
    });

    return api;
}

export default () => {
    Vue.prototype.$api = generateAPI(<%= options.controllers %>);
};
