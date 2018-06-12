import test from 'ava';
import qs from 'querystring';

test.before(globalBeforeAll({
    moduleOptions: {
        bodyParsers: [
            'json',
            {
                adapter: 'urlencoded'
            }
        ]
    }
}));
test.after(globalAfterAll());

test('Test json body parser', async (t) => {
    const {data} = await api.post('/users', {
        first_name: 'nuxt',
        last_name: 'neo'
    });

    t.true(data.ok);
    t.is(data.body.first_name, 'nuxt');
    t.is(data.body.last_name, 'neo');
});

test('Test uri encoded body parser', async (t) => {
    const {data} = await api.post(
        '/users',
        qs.stringify({
            first_name: 'nuxt',
            last_name: 'neo'
        }),
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
    );

    t.true(data.ok);
    t.is(data.body.first_name, 'nuxt');
    t.is(data.body.last_name, 'neo');
});