class Service {
    constructor(request, response) {
        this.request   = request;
        this.response  = response;
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

    /**
     * Gets a data provider connection.
     *
     * @param name
     * @returns {*}
     */
    getDataProvider(name) {
        if (!this.request.getDataProvider) {
            throw new Error('Data Providers are disabled.');
        }

        return this.request.getDataProvider(name);
    }
}

module.exports = Service;