class Controller {

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

Controller.ROUTES     = {};
Controller.MIDDLEWARE = [];

module.exports = Controller;