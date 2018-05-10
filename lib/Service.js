class Service {
    constructor(request) {
        this.request  = request;
    }

    /**
     * Gets another service, lazy loaded.
     *
     * @param key
     * @returns {*}
     */
    getService(key) {
        return this.request.getService(key);
    }
}

module.exports = Service;