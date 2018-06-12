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
            if (err && err.statusCode) {
                throw err;
            }

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

test('Test bad request response due invalid input data', async (t) => {
    try {
        await api.post('/products?exception=BadRequestError&message=bad_request');
    } catch (err) {
        t.is(err.response.status, 400);
        t.is(err.response.data.message, 'bad_request');
    }
});

test('Test unauthorized context response due invalid input data', async (t) => {
    try {
        await api.post('/products?exception=UnauthorizedError&message=no_access');
    } catch (err) {
        t.is(err.response.status, 401);
        t.is(err.response.data.message, 'no_access');
    }
});

test('Test forbidden context response due invalid input data', async (t) => {
    try {
        await api.post('/products?exception=ForbiddenError');
    } catch (err) {
        t.is(err.response.status, 403);
        t.is(err.response.data.message, 'Forbidden');
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
