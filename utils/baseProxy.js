const packageInfo = require('../package.json');
const queryString = require('querystring');
const log = require('./logger');

class baseProxy {
  // check params
  constructor(option) {
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
    this.options = {
      log: log(option.logLevel || 'info'),
      proxyTimeout: option.proxyTimeout || 30000,
      proxies: option.proxies,
      rewrite: option.rewrite ? () => option.rewrite : pattern => path => path.replace(pattern, ''),
      handleReq: option.proxyReq,
      handleRes: option.proxyRes,
      handleError: option.error,
    };
  }
  // handle event：proxyReq、proxyRes、error
  handle(proxyServer) {
    const { handleReq, handleRes, handleError } = this.options;
    proxyServer.on('proxyReq', (proxyReq, req, res, options) => {
      if (handleReq) {
        handleReq.call(null, { proxyReq, req, res, options, log: this.options.log });
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
    proxyServer.on('proxyRes', (proxyRes, req, res) => {
      if (handleRes) {
        handleRes.call(null, { proxyRes, req, res, log: this.options.log });
      }
    });
    proxyServer.on('error', (err, req, res) => {
      if (handleError) {
        handleError.call(null, { err, req, res, log: this.options.log });
      }
    });
  }
}

module.exports = baseProxy;
