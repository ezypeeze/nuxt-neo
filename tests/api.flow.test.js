import test from 'ava';

test.before(globalBeforeAll({
    moduleOptions: {
        prefix: '/api/v2'
    }
}));
test.after(globalAfterAll());

test('Test api prefix (GET /api/v2)', async (t) => {
    try {
        await api.get('/users/categories');
    } catch (err) {
        t.is(err.response.status, 404);
    }
});

test('Test first level api (GET /api/v2/users)', async (t) => {
    const {data} = await api.get('/users');
    t.true(data.ok);
});

test('Test second level api (GET /api/v2/users/categories) - should give 404', async (t) => {
    try {
        await api.get('/users/categories');
    } catch (err) {
        t.is(err.response.status, 404);
    }
});

test('Test third level api (GET /api/v2/users/categories/types)', async (t) => {
    const {data} = await api.get('/users/categories/types');
    t.true(data.ok);
});

test('Test hybrid api data flow server side.', async (t) => {
    const window           = await nuxt.renderAndGetWindow(URL('/'));
    const path             = window.document.querySelector('.index span.path');
    const okay             = window.document.querySelector('.index span.okay');

    t.is(okay.textContent, "It's okay!");

    // Since it accessed to controller on server side, the request path should be '/' which was what we rendered above
    t.is(path.textContent, '/');
});

test('Test hybrid api data flow server side.', async (t) => {
    const window           = await nuxt.renderAndGetWindow(URL('/'));
    const path             = window.document.querySelector('.index span.path');
    const okay             = window.document.querySelector('.index span.okay');

    t.is(okay.textContent, "It's okay!");

    // Since it accessed to controller on server side, the request path should be '/' which was what we rendered above
    t.is(path.textContent, '/');
});

test('Test hybrid api data flow client side', async (t) => {
    const window     = await nuxt.renderAndGetWindow(URL('/'));
    const clickEvent = new window.Event('click');
    const path       = window.document.querySelector('.index span.path');
    const okay       = window.document.querySelector('.index span.okay');
    const changePath = window.document.querySelector('.index .change-path');

    changePath.dispatchEvent(clickEvent);
    await new Promise(resolve => setTimeout(resolve, 1000)); // wait for API request

    t.is(path.textContent, '/api/v2/users');
    t.is(okay.textContent, "It's okay!");
});
