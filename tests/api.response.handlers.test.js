import test from 'ava';

test.before(globalBeforeAll({
    moduleOptions: {
        prefix: '/api/v2',
        successHandler: function ({ok, params}, req) {
            return {
                meta: {
                    offset: req.query.offset,
                    limit: req.query.limit,
                    ok
                },
                payload: params,
            }
        },
        errorHandler: function (err) {
            throw new Error('[NEW ERROR] ' + err.message);
        },
        notFoundRouteResponse: function (req, res) {
            return res.status(404).json({message: `The route "${req.url}" was not found.`});
        }
    }
}));
test.after(globalAfterAll());

test('Test success handler', async (t) => {
    const {data} = await api.get('/products');

    t.true(data.meta.ok);
    t.true(!!data.payload);
});

test('Test error handler', async (t) => {
    try {
        await api.get('/products?force_error=true');
    } catch (err) {
        t.is(err.response.status, 500);
        t.is(err.response.data.message, '[NEW ERROR] Forced error');
    }
});

test('Test not found route response', async (t) => {
    try {
        await api.get('/products/categories/types');
    } catch (err) {
        t.is(err.response.status, 404);
        t.is(err.response.data.message, 'The route "/products/categories/types" was not found.')
    }
});
