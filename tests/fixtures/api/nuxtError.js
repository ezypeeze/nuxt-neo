class NuxtErrorController {
    error() {
        throw new Error("nuxtError");
    }
}

NuxtErrorController.ROUTES = {
    error: {
        path: '/',
        verb: 'GET'
    },
};

NuxtErrorController.MIDDLEWARE = [];

module.exports = NuxtErrorController;
