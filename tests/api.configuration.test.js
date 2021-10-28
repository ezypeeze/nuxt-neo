import test from 'ava';

/* global globalBeforeAll:readable, globalAfterAll:readable, api:readable */

test.before(globalBeforeAll({
    nuxtOptions: {
        nuxtNeo: {
            prefix: '/api/v2',
            errorHandler: '~/error_handler'
        }
    }
}));
test.after(globalAfterAll());

test('Test first level api (GET /api/v2/users) with options specified in nuxt config', async (t) => {
    const { data } = await api.get('/users');
    t.true(data.ok);
});
