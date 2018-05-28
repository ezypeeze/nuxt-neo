// Default Environment Variables
process.env.PORT     = process.env.PORT || 3000;
process.env.HOST     = process.env.HOST || 'localhost';
process.env.NODE_ENV = 'testing';

import _ from 'lodash/fp/object';
import {Nuxt, Builder} from 'nuxt';
import axios from 'axios';
import TestController from '../fixtures/test_controller';

// Globalize Test Controller
global.TestController = TestController;

// Globalize nuxt instance
global.nuxt = new Nuxt(require('../fixtures/nuxt.config'));

// Globalize before all function
global.globalBeforeAll = function ({moduleOptions, nuxtOptions} = {}) {
    return async function () {
        let options = require('../fixtures/nuxt.config');
        if (nuxtOptions) options = _.merge(options, nuxtOptions);
        if (moduleOptions) {
            const defaultModuleOptions = options.modules[0];
            defaultModuleOptions[1] = _.merge(defaultModuleOptions[1], moduleOptions);
            options.modules = [ defaultModuleOptions ];
        }

        global.nuxt = new Nuxt(options);

        // Globalize API requests
        global.api = axios.create({
            baseURL: URL(options.modules[0][1].prefix || '/api')
        });

        await new Builder(nuxt).build();
        await nuxt.listen(process.env.PORT, process.env.HOST);
    }
};

// Globalize after all function
global.globalAfterAll = function () {
    return async function () {
        await nuxt.close();
    };
};

// Globalize Test server URL generator
global.URL = path => `http://${process.env.HOST}:${process.env.PORT}${path || ''}`;
