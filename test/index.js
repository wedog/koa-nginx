/**
 * Created by ly_wu on 2017/6/21.
 */
import test from 'ava';
import proxy from '../index';
test('foo', t => {
    t.pass();
});

test('bar', async t => {
    const bar = Promise.resolve('bar');

    t.is(await bar, 'bar');
});