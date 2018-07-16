import test from 'ava';

test.before(globalBeforeAll({
    moduleOptions: {
        prefix: '/api/v2',
        middleware: [
            function (req) {
                req.locals = {
                    test: true
                };
            }
        ]
    }
}));
test.after(globalAfterAll());

test('Test middleware for a controller', async (t) => {
    const getProducts   = await api.get('/products');
    const getProduct    = await api.get('/products/123123');
    const postProduct   = await api.post('/products');
    const putProduct    = await api.put('/products/123123');
    const deleteProduct = await api.delete('/products/123123');

    t.true(getProducts.data.controller_middleware);
    t.true(getProduct.data.controller_middleware);
    t.true(postProduct.data.controller_middleware);
    t.true(putProduct.data.controller_middleware);
    t.true(deleteProduct.data.controller_middleware);
});

test('Test middleware for a specific action: allAction', async (t) => {
    const getProducts   = await api.get('/products');
    const getProduct    = await api.get('/products/123123');
    const postProduct   = await api.post('/products');
    const putProduct    = await api.put('/products/123123');
    const deleteProduct = await api.delete('/products/123123');

    t.true(getProducts.data.action_middleware);
    t.false(!!getProduct.data.action_middleware);
    t.false(!!postProduct.data.action_middleware);
    t.false(!!putProduct.data.action_middleware);
    t.false(!!deleteProduct.data.action_middleware);
});

