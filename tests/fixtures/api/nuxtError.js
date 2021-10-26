export default class NuxtErrorController {
    static ROUTES = {
        error: {
            path: '/',
            verb: 'GET'
        }
    };

    error() {
        throw new Error("nuxtError");
    }
}
