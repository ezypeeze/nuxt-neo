import test from 'ava';

/* global globalBeforeAll:readable, globalAfterAll:readable, api:readable */

test.before(globalBeforeAll({
    moduleOptions: {
        extendRouter: (router) => {
            router.use(function (req, res) {
                res.send('NOTHING GOES BEYOUND THIS');
            });
        }
    }
}));
test.after(globalAfterAll());

test('Test extend router function', async (t) => {
    const { data } = await api.post('/users', {
        first_name: 'nuxt',
        last_name: 'neo'
    });

    t.is(data, 'NOTHING GOES BEYOUND THIS');
});
