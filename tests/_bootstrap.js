jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
process.env.PORT                 = process.env.PORT || 3000;
process.env.HOST                 = process.env.HOST || 'localhost';
process.env.NODE_ENV             = 'testing';

global.TestController = require('./fixtures/test_controller');

const { Nuxt, Builder } = require('nuxt');
const axios = require('axios');
const URL = path => `http://${process.env.HOST}:${process.env.PORT}${path || ''}`;
const nuxt = new Nuxt(require('./fixtures/nuxt.config'));

async function globalBeforeAll () {
    await new Builder(nuxt).build();
    await nuxt.listen(process.env.PORT, 'localhost');
}

async function globalAfterAll () {
    await nuxt.close();
}

const api = axios.create({
    baseURL: URL('/api')
});

module.exports = {nuxt, Builder, URL, globalBeforeAll, globalAfterAll, api};