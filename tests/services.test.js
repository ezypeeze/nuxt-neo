import test from 'ava';

test.before(globalBeforeAll());
test.after(globalAfterAll());

test('Test users services handler', async (t) => {
    const {data} = await api.get('/users');

    t.true(!!data.users);
    t.is(data.users.length, 10);
});
