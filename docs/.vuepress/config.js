module.exports = {
    locales: {
        '/': {
            lang: 'en-us',
            title: 'Nuxt Neo',
            description: 'A nuxt.js module that implements a universal api layer, same-way compatible between server and client side.'
        }
    },
    themeConfig: {
        locales: {
            '/': {
                nav: [
                    {
                        text: 'Languages',
                        items: [
                            { text: 'English', link: '/' },
                        ]
                    },
                    { text: 'GitHub', link: 'https://github.com/ezypeeze/nuxt-neo' }
                ],
                sidebar: [
                    ['/', 'Intro'],
                    ['/getting-started', 'Getting Started'],
                    ['/basic-usage', 'Basic Usage'],
                ]
            }
        }
    }
};