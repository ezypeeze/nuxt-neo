const path = require('path');

module.exports = {
    modules: [
        [path.join(__dirname, '../../lib', 'module'), {
            debug: true,
            successHandler: '~/success_handler'
        }]
    ],

    build: {
        babel: {
            presets({ isServer }) {
                return [
                    [
                        require.resolve('@nuxt/babel-preset-app'),
                        {
                            buildTarget: isServer ? 'server' : 'client',
                            corejs: { version: 3 }
                        }
                    ]
                ]
            }
        }
    },

    dev: false,

    srcDir: __dirname, // fixtures folder, where all the test code will be.

    env: {
        PORT: process.env.PORT,
        HOST: process.env.HOST
    }
};
