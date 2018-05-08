jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
process.env.PORT                 = process.env.PORT || 3000;
process.env.HOST                 = process.env.HOST || 'localhost';
process.env.NODE_ENV             = 'testing';

const { Nuxt, Builder } = require('nuxt');

const URL = path => `http://${process.env.HOST}:${process.env.PORT}/api${path}`;

module.exports = {Nuxt, Builder, URL};