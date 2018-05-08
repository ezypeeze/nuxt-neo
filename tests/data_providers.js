const {Nuxt, Builder, URL} = require('./_bootstrap');

describe('Data Providers (File discover of adapters, lazy loading data providers, request injection)', () => {
    let nuxt;

    beforeAll(async () => {
        nuxt = new Nuxt(require('./fixtures/nuxt.config'));
        await new Builder(nuxt).build();
        await nuxt.listen(process.env.PORT || 3000);
    });

    afterAll(async () => {
        await nuxt.close();
    });

    test('init', async () => {
        // TODO!
        // const window = await nuxt.renderAndGetWindow(url('/'));
        // const headers = window.document.head.innerHTML;
        // expect(headers).toMatchSnapshot();
    });

});