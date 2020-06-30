// Default Environment Variables
process.env.PORT     = process.env.PORT || 3000;
process.env.HOST     = process.env.HOST || 'localhost';
process.env.NODE_ENV = 'test';

/* global nuxt:readable */

const _ = require("lodash/fp/object");
const { Nuxt, Builder } = require("nuxt");
const axios = require("axios");
const TestController = require("../fixtures/test_controller");

// Globalize Test Controller
global.TestController = TestController;

// Globalize before all function
global.globalBeforeAll = function ({ moduleOptions, nuxtOptions } = {}) {
    return function () {
        let options = require('../fixtures/nuxt.config');
        if (nuxtOptions) {
            options = _.merge(options, nuxtOptions);
        }
        if (moduleOptions) {
            const defaultModuleOptions = options.modules[0];
            defaultModuleOptions[1] = _.merge(defaultModuleOptions[1], moduleOptions);
            options.modules = [defaultModuleOptions];
        }

        // Create nuxt instance
        const nuxt = new Nuxt(options);

        // Globalize API requests
        const api = axios.create({
            baseURL: URL(options.modules[0][1].prefix || '/api')
        });

        // Build and create web server
        return new Builder(nuxt).build()
            .then(function() {
                global.nuxt = nuxt;
                global.api = api;

                nuxt.listen(process.env.PORT, process.env.HOST);
            })
            .catch(function (err) {
                console.error(err);

                throw err;
            });
    }
};

// Globalize after all function
global.globalAfterAll = function () {
    return function () {
        return nuxt.close();
    };
};

// Globalize Test server URL generator
global.URL = path => `http://${process.env.HOST}:${process.env.PORT}${path || ''}`;