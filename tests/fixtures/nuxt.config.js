import path from 'path';

/** @type {import('@nuxt/types').NuxtConfig} */
const config = {
    modules: [
        [path.join(__dirname, '../../lib', 'module'), {
            debug: true,
            successHandler: '~/success_handler'
        }]
    ],

    env: {
        HOST: process.env.HOST,
        PORT: process.env.PORT
    },

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
                ];
            }
        }
    },

    dev: false,

    srcDir: __dirname // fixtures folder, where all the test code will be.
};

export default config;
