/**
 * Async Data helper to fetch data.
 *
 * @param flow
 * @returns {Function}
 */
function asyncData(flow) {
    return function (context) {
        context.app.$api = process.server ? context.req.generateControllersTree() : context.app.$api;

        switch (typeof flow) {
            case 'function':
                return Promise.resolve(flow(context));
            case 'object':
                const result = {};
                return Promise.all(
                    Object.keys(flow).map(function (key) {
                        return Promise.resolve(flow[key] && flow[key](context)).then(function (value) {
                            result[key] = value;
                        });
                    })
                ).then(() => result);
            default:
                throw new Error('First parameters must be either a function or an object');
        }
    }
}

/**
 * Fetch helper to fetch data.
 *
 * @param flow
 * @returns {Function}
 */
function fetch(flow) {
    return function (context) {
        context.app.$api = context.req ? context.req.generateControllersTree() : context.app.$api;

        switch (typeof flow) {
            case 'function':
                return Promise.resolve(flow(context))
                    .then(function (result) {
                        Object.keys(result || {}).forEach(function (key) {
                            context.store.commit(key, result[key]);
                        });
                    });
            case 'object':
                return Promise.all(
                    Object.keys(flow).map(function (key) {
                        Promise.resolve(flow[key] && flow[key](context)).then(function (result) {
                            context.store.commit(key, result);
                        });
                    })
                );
            default:
                throw new Error('First parameters must be either a function or an object');
        }
    }
}


if (process.server) {
    global.asyncData = asyncData;
    global.fetch     = fetch;
}

if (process.browser) {
    window.asyncData = asyncData;
    window.fetch     = fetch;
}
