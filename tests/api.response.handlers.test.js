import test from 'ava';

/* global globalBeforeAll:readable, globalAfterAll:readable, api:readable */

test.before(globalBeforeAll({
    moduleOptions: {
        prefix: '/api/v2',
        serverSuccessResponse: function (req, res) {
            return res.status(200).json({ meta: { ok: true }, payload: res.result });
        },
        serverErrorResponse: function (err, req, res) {
            if (err.httpError) {
                return res.status(err.statusCode).json({ message: err.message });
            }

            return res.status(500).json({ message: '[NEW ERROR] Forced error' });
        },
        serverNotFoundRouteResponse: function (req, res) {
            return res.status(404).json({ message: `The route "${req.url}" was not found.` });
        }
    }
}));
test.after(globalAfterAll());

test('Test success handler', async (t) => {
    const { data } = await api.get('/products');

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
        t.is(err.response.data.message, 'The route "/products/categories/types" was not found.');
    }
});
