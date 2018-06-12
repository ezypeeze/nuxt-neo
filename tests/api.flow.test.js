import test from 'ava';

test.before(globalBeforeAll({
    moduleOptions: {
        prefix: '/api/v2'
    }
}));
test.after(globalAfterAll());

test('Test first level api (GET /api/v2/users)', async (t) => {
    const {data} = await api.get('/users');
    t.true(data.ok);
});

test('Test second level api (GET /api/v2/foo) - should give 404', async (t) => {
    try {
        await api.get('/foo');
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
    const resMiddle        = window.document.querySelector('.index span.response-middleware');

    t.is(okay.textContent, "It's okay!");
    t.is(resMiddle.textContent, "It's okay!");

    // Since it accessed to controller on server side, the request path should be '/' which was what we rendered above
    t.is(path.textContent, '/');
});

test('Test hybrid api data flow client side', async (t) => {
    const window     = await nuxt.renderAndGetWindow(URL('/'));
    const path       = window.document.querySelector('.index span.path');
    const okay       = window.document.querySelector('.index span.okay');
    const idParam    = window.document.querySelector('.index span.id-param');
    const changePath = window.document.querySelector('.index .change-path');
    const resMiddle  = window.document.querySelector('.index span.response-middleware');
    const numOfUsers = window.document.querySelector('.index span.number-of-users');
    const createUser = window.document.querySelector('.index .create-user');
    const firstUser  = window.document.querySelector('.index .first-user');
    const ssError    = window.document.querySelector('.index .server-side-force-error');

    changePath.dispatchEvent(new window.Event('click'));
    await new Promise(resolve => setTimeout(resolve, 1000)); // wait for API request
    createUser.dispatchEvent(new window.Event('click'));
    await new Promise(resolve => setTimeout(resolve, 1000)); // wait for API request
    createUser.dispatchEvent(new window.Event('click'));
    await new Promise(resolve => setTimeout(resolve, 1000)); // wait for API request

    t.is(path.textContent, '/api/v2/users/1');
    t.is(okay.textContent, "It's okay!");
    t.is(idParam.textContent, '1');
    t.is(resMiddle.textContent, "It's okay!");
    t.is(numOfUsers.textContent, '5'); // 3 nuxt.renderAndGetWindow (auto create on asyncData page) and 2 clicks to add user == 5
    t.true(!!ssError);
    t.is(ssError.textContent, 'Forced error');
    t.true(!!firstUser);
    t.is(firstUser.textContent, 'first');
});
