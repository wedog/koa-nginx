const Proxy = require('../');
const request = require('supertest');
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
let serverNgnix;
let server;

beforeAll(() => {
  const app = new Koa();
  app.use(bodyParser());
  app.use(async (ctx, next) => {
    let res;
    switch (ctx.url) {
      case '/getMethod': res = {
        status: 'ok',
        data: ctx.request.body,
      }; break;
      case '/bodyParse': res = {
        status: 'ok',
        data: ctx.request.body,
      }; break;
      default: res = ''; break;
    }
    ctx.body = res;
    await next();
  });
  server = app.listen(3333);
});
afterEach(() => {
  if (serverNgnix) {
    serverNgnix.close();
  }
});

afterAll(() => {
  server.close();
});

describe('koa-ngnix test', () => {
  test('terminal server is active', done => {
    request(server)
      .get('/')
      .expect(200, () => {
        done();
      });
  });

  test('POST method at bodyparser Middleware test', done => {
    const app = new Koa();
    const ngnix = new Proxy({
      proxies: [
        {
          host: 'http://localhost:3333/',
          context: 'ngnix',
        },
      ],
    });
    app.use(bodyParser());
    app.use(ngnix);
    serverNgnix = app.listen();
    request(serverNgnix)
      .post('/ngnix/bodyParse')
      .send({
        test: 1111,
      })
      .expect(res => {
        console.log(res.body);
      })
      .expect(200, () => {
        done();
      });
  });

  test('GET method test', done => {
    const app = new Koa();
    const ngnix = new Proxy({
      proxies: [
        {
          host: 'http://localhost:3333/',
          context: 'ngnix',
        },
      ],
    });
    app.use(ngnix);
    serverNgnix = app.listen();
    request(serverNgnix)
      .get('/ngnix/getMethod')
      .send({
        test: 2222,
      })
      .expect(res => {
        console.log(res.body);
      })
      .expect(200, () => {
        done();
      });
  });


});

