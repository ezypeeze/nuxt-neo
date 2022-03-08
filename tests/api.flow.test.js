import test from 'ava';

/* global globalBeforeAll:readable, globalAfterAll:readable, serverUrl:readable, api:readable, nuxt:readable */

test.before(globalBeforeAll({
    moduleOptions: {
        prefix: '/api/v2',
        errorHandler: '~/error_handler'
    }
}));
test.after(globalAfterAll());

test('Test first level api (GET /api/v2/users)', async (t) => {
    const { data } = await api.get('/users');
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
    const { data } = await api.get('/users/categories/types');
    t.true(data.ok);
});

test('Test hybrid api data flow server side.', async (t) => {
    const window = await nuxt.renderAndGetWindow(serverUrl('/'));
    const path = window.document.querySelector('.index div.path');
    const okay = window.document.querySelector('.index div.okay');
    const resMiddle = window.document.querySelector('.index div.response-middleware');

    t.is(okay.textContent, "It's okay!");
    t.is(resMiddle.textContent, "It's okay!");

    // Since it accessed to controller on server side, the request path should be '/' which was what we rendered above
    t.is(path.textContent, '/');

    // Test http errors
    t.true('BadRequestError' in global);
    t.true('UnauthorizedError' in global);
    t.true('ForbiddenError' in global);
    t.true('NotFoundError' in global);
    t.true('InternalServerError' in global);
});

test('Test hybrid api data flow client side', async (t) => {
    const window = await nuxt.renderAndGetWindow(serverUrl('/'));
    const path = window.document.querySelector('.index div.path');
    const okay = window.document.querySelector('.index div.okay');
    const idParam = window.document.querySelector('.index div.id-param');
    const changePath = window.document.querySelector('.index .change-path');
    const changePathWithoutParam = window.document.querySelector('.index .change-path-without-param');
    const getOptional = window.document.querySelector('.index .get-optional');
    const resMiddle = window.document.querySelector('.index div.response-middleware');
    const numOfUsers = window.document.querySelector('.index div.number-of-users');
    const createUser = window.document.querySelector('.index .create-user');
    const firstUser = window.document.querySelector('.index .first-user');
    let errorMessage = window.document.querySelector('.index .error-message');
    const errorMessageGetOptional = window.document.querySelector('.index .error-message-get-optional');
    const errorMessageGetWithoutParam = window.document.querySelector('.index .error-message-get-without-param');

    // First check potential errors from the server-side (asyncData) calls.
    t.truthy(errorMessage);
    t.is(errorMessage.textContent, 'Forced error');
    t.falsy(errorMessageGetOptional);
    t.truthy(errorMessageGetWithoutParam);
    t.is(errorMessageGetWithoutParam.textContent, 'Expected "id" to be a string');

    changePath.dispatchEvent(new window.Event('click'));
    await new Promise(resolve => setTimeout(resolve, 2000)); // wait for API request
    createUser.dispatchEvent(new window.Event('click'));
    await new Promise(resolve => setTimeout(resolve, 2000)); // wait for API request
    createUser.dispatchEvent(new window.Event('click'));
    await new Promise(resolve => setTimeout(resolve, 2000)); // wait for API request

    t.is(path.textContent, '/api/v2/users/1');
    t.is(okay.textContent, "It's okay!");
    t.is(idParam.textContent, '1');
    t.is(resMiddle.textContent, "It's okay!");
    t.is(numOfUsers.textContent, '4'); // 3 nuxt.renderAndGetWindow (auto create on asyncData page) and 2 clicks to add user == 5
    t.truthy(errorMessage);
    t.is(errorMessage.textContent, 'Forced error');
    t.truthy(firstUser);
    t.is(firstUser.textContent, 'first');

    changePathWithoutParam.dispatchEvent(new window.Event('click'));
    await new Promise(resolve => setTimeout(resolve, 2000)); // wait for API request
    errorMessage = window.document.querySelector('.index .error-message');
    t.is(errorMessage.textContent, 'Expected "id" to be a string'); // error when no required param is given

    getOptional.dispatchEvent(new window.Event('click'));
    await new Promise(resolve => setTimeout(resolve, 2000)); // wait for API request
    errorMessage = window.document.querySelector('.index .error-message');
    t.falsy(errorMessage);  // optional param so doesn't error when not provided

    // Test http errors
    t.true('BadRequestError' in window);
    t.true('UnauthorizedError' in window);
    t.true('ForbiddenError' in window);
    t.true('NotFoundError' in window);
    t.true('InternalServerError' in window);
});
