/**
 * Created by ly_wu on 2017/6/21.
 */
import test from 'ava';
import koa from 'koa';
import request from 'supertest';
import bodyParser from 'koa-bodyparser';
import proxy from '../index';

test.beforeEach(t => {
    const app = new koa();
    app.use(bodyParser());
    app.use(async(ctx, next) => {
        if(ctx.url == "/sign"){
            ctx.status = 200;
            ctx.body = ctx.request.body;
        }
    });
    t.context.app = app.listen(3000);
});

test.afterEach(t => {
    t.context.app.close();
});

test.serial('there should be a terminal server', async t => {
    const res = await request(t.context.app)
        .post('/sign')
        .send({});
    t.is(res.status, 200);
});

test.serial('should have option host and context', async t => {
    const app = new koa();
    const options = [{
        "host": "http://127.0.0.1:3000/",
        "context": "terminal"
    }];
    app.use(proxy.proxy(options));
    let server = app.listen();
    const res = await request(server)
        .post('/terminal/sign')
        .send({});
    t.is(res.status, 200);
});

test.serial('behind bodyparser in proxy Middleware', async t=>{
    const app = new koa();
    const options = [{
        "host": "http://127.0.0.1:3000/",
        "context": "terminal"
    }];
    app.use(proxy.proxy(options));
    app.use(bodyParser());
    let server = app.listen();
    const res = await request(server)
        .post('/terminal/sign')
        .send({
            paramA: "hello",
            paramB: 2
        });
    t.is(res.status, 200);
    t.is(res.body.paramB, 2);
});

test.serial('bodyParser in front of the proxy Middleware', async t=>{
    const app = new koa();
    //app.use(bodyParser());
    const options = [{
        "host": "http://127.0.0.1:3000/",
        "context": "terminal"
    }];
    app.use(proxy.proxy(options));
    let server = app.listen();
    const res = await request(server)
        .post('/terminal/sign')
        .send({});
    t.fail("error")
});