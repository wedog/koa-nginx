/**
 * Created by ly_wu on 2017/6/21.
 */
const HttpProxy = require('http-proxy');
const proxyServer = HttpProxy.createProxyServer();
const compose = require('koa-compose');
const baseProxy = require('./utils/baseProxy');

class Proxy extends baseProxy {
  nginx(context, options) {
    return (ctx, next) => {
      if (!ctx.url.startsWith(context)) {
        return next();
      }
      const { logs, rewrite, target } = options;

      ctx.req.body = ctx.request.body || null;
      options.headers = ctx.request.headers;
      return new Promise(resolve => {
        if (typeof rewrite === 'function') {
          ctx.req.url = rewrite(ctx.url);
        }
        if (logs) {
          this.options.log.info(
            target,
            '- proxy -',
            ctx.req.method,
            ctx.req.url
          );
        }
        proxyServer.web(ctx.req, ctx.res, options, e => {
          const status = {
            ECONNRESET: 502,
            ECONNREFUSED: 503,
            ETIMEOUT: 504,
          }[ e.code ];
          if (status) ctx.status = status;
          if (this.options.handleError) {
            this.options.handleError.call(null, { e, req: ctx.req, res: ctx.res });
          }
          if (logs) {
            this.options.log.error('- proxy -', ctx.status, ctx.req.method, ctx.req.url);
          }
          resolve();
        });
      });
    };
  }
  proxy(options) {
    this.checkOut(options);
    const mildArr = [];
    const { proxies, rewrite, proxyTimeout } = this.options;
    this.handle(proxyServer);
    proxies.forEach(proxy => {
      const pattern = new RegExp('^/' + proxy.context + '(/|/w+)?');
      mildArr.push(
        this.nginx('/' + proxy.context, {
          target: proxy.host,
          changeOrigin: true,
          xfwd: true,
          rewrite: proxy.rewrite || rewrite(pattern),
          logs: proxy.log || true,
          proxyTimeout: proxy.proxyTimeout || proxyTimeout,
        })
      );
    });
    return compose(mildArr);
  }
}
module.exports = new Proxy();
