const LIB_DIR  = __dirname + '/../../lib';
const TEST_DIR = __dirname + '/..';

module.exports = {
    modules: [
        [LIB_DIR + '/module', {
            directory: TEST_DIR + '/fixtures/api',
            debug: true
        }]
    ],

    dev: false,

    srcDir: __dirname, // fixtures folder, where all the test code will be.

    env: {
        PORT: process.env.PORT,
        HOST: process.env.HOST
    }
};
