const {URL, globalBeforeAll, globalAfterAll, api, nuxt} = require('./_bootstrap');

describe('API Module (Controllers API Routes, Universal $api for page components of Vue)', () => {

    beforeAll(globalBeforeAll);

    afterAll(globalAfterAll);

    test('Test first level api (GET /users)', async () => {
        const {data} = await api.get('/users');
        expect(data).toEqual(
            expect.objectContaining({
                ok: true
            })
        );
    });

    test('Test second level api (GET /users/categories) - should give 404', async () => {
        try {
            await api.get('/users/categories');
        } catch (err) {
            expect(err.response.status).toEqual(404);
        }
    });

    test('Test third level api (GET /users/categories/types)', async () => {
        const {data} = await api.get('/users/categories/types');
        expect(data).toEqual(
            expect.objectContaining({
                ok: true
            })
        );
    });

    test('Test hybrid api data flow, client and server side', async () => {
        const window = await nuxt.renderAndGetWindow(URL('/'));
        expect(window.document.querySelector('.index span').textContent).toEqual("It's okay!");
    });

});