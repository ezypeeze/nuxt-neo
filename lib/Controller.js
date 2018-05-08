class Controller {

    static ROUTES = {};

    constructor(request) {
        this.request = request;
    }

    /**
     * Gets a service
     * @return {Service|*}
     */
    getService(key) {
        if (!this.request.getService) {
            throw new Error('Services are disabled.');
        }

        return this.request.getService(key);
    }

}

module.exports = Controller;