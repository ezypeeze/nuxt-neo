// Default Environment Variables
process.env.PORT     = process.env.PORT || 3000;
process.env.HOST     = process.env.HOST || 'localhost';
process.env.NODE_ENV = 'testing';

import {Nuxt, Builder} from 'nuxt';
import axios from 'axios';
import TestController from '../fixtures/test_controller';

// Globalize Test Controller
global.TestController =TestController;

// Globalize nuxt instance
global.nuxt = new Nuxt(require('../fixtures/nuxt.config'));

// Globalize before all function
global.globalBeforeAll = async function () {
    await new Builder(nuxt).build();
    await nuxt.listen(process.env.PORT, process.env.HOST);
};

// Globalize after all function
global.globalAfterAll = async function () {
   await nuxt.close();
};

// Globalize Test server URL generator
global.URL = path => `http://${process.env.HOST}:${process.env.PORT}${path || ''}`;

// Globalize API requests
global.api = axios.create({
    baseURL: URL('/api')
});
