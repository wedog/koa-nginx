/**
 * Created by ly_wu on 2017/6/21.
 */
const HttpProxy = require('http-proxy');
const proxyServer = HttpProxy.createProxyServer();
const compose = require('koa-compose');
const queryString = require('querystring');
const log = require('./logger');
const packageInfo = require('./package.json');

class Proxy {
  constructor(option) {
    this.options = this.checkParams(option);
    return this.proxy();
  }
  // 参数校验
  checkParams(option) {
    const { name } = packageInfo;
    if (!option) {
      throw Error(`${name}: missing main parameters`);
    }
    if (!option.proxies || !Array.isArray(option.proxies)) {
      throw Error(`${name}: The parameter is required and the type must be Array: proxyArray`);
    }
    if (option.rewrite && typeof option.rewrite !== 'function') {
      throw Error(`${name}: the type must be Function: rewrite`);
    }
    return {
      level: option.logLevel || 'info',
      proxyTimeout: option.proxyTimeout || 30000,
      proxies: option.proxies,
      rewrite: option.rewrite ? option.rewrite : pattern => path => path.replace(pattern, ''),
      handleReq: option.proxyReq,
      handleRes: option.proxyRes,
      handleError: option.error,
    };
  }
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
          log.info(
            target,
            '- proxy -',
            ctx.req.method,
            ctx.req.url
          );
        }
        proxyServer.web(ctx.req, ctx.res, options, e => {
          const status = {
            ECONNREFUSED: 503,
            ETIMEOUT: 504,
          }[ e.code ];
          if (status) ctx.status = status;
          if (logs) {
            log.error('- proxy -', ctx.status, ctx.req.method, ctx.req.url);
          }
          resolve();
        });
      });
    };
  }
  proxy() {
    const mildArr = [];
    const { proxies, rewrite } = this.options;
    this.handle();
    proxies.forEach(proxy => {
      const pattern = new RegExp('^/' + proxy.context + '(/|/w+)?');
      mildArr.push(
        this.nginx('/' + proxy.context, {
          target: proxy.host,
          changeOrigin: true,
          xfwd: true,
          rewrite: proxy.rewrite || rewrite(pattern),
          logs: proxy.log || true,
        })
      );
    });
    return compose(mildArr);
  }

  handle() {
    const { handleReq, handleRes, handleError } = this.options;
    proxyServer.on('proxyReq', (...args) => {
      const [ proxyReq, req ] = args;
      if (handleReq) {
        handleReq.apply(null, args);
      }
      if (req.body && Object.keys(req.body).length) {
        const contentType = proxyReq.getHeader('Content-Type');
        let bodyData;
        switch (contentType) {
          case 'application/json': bodyData = JSON.stringify(req.body); break;
          case 'application/x-www-form-urlencoded': bodyData = queryString.stringify(req.body); break;
          default: break;
        }
        if (bodyData) {
          proxyReq.write(bodyData);
          proxyReq.end();
        }
      }
    });
    proxyServer.on('proxyRes', (...args) => {
      if (handleRes) {
        handleRes.apply(null, args);
      }
    });
    proxyServer.on('error', (...args) => {
      if (handleError) {
        handleError.apply(null, args);
      }
    });
  }
}

module.exports = Proxy;
