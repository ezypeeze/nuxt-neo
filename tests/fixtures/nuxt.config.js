const LIB_DIR  = __dirname + '/../../lib';

module.exports = {
    modules: [
        [LIB_DIR + '/module', {
            debug: true,
            responseMiddleware: '~/response_middleware'
        }]
    ],

    dev: false,

    srcDir: __dirname, // fixtures folder, where all the test code will be.

    env: {
        PORT: process.env.PORT,
        HOST: process.env.HOST
    }
};
