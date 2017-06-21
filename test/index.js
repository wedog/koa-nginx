/**
 * Created by ly_wu on 2017/6/21.
 */
import test from 'ava';
test('foo', t => {
    t.pass();
});

test('bar', async t => {
    const bar = Promise.resolve('bar');

    t.is(await bar, 'bar');
});