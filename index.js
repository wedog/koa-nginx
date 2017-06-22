/**
 * Created by ly_wu on 2017/6/21.
 */
const path          = require("path");
const HttpProxy     = require('http-proxy');
const proxyServer   = HttpProxy.createProxyServer();
const compose       = require("./compose");

class Proxy {
    constructor() {

    }
    static nginx (context, options){
        return (ctx, next) => {
            if (!ctx.url.startsWith(context)){
                return next();
            }
            const { logs, rewrite } = options;
            options.headers = ctx.request.headers;
            return new Promise((resolve, reject) => {
                if (logs){
                    console.log('%s - proxy - %s %s', new Date().toISOString(), ctx.req.method, ctx.req.url);
                }
                if (typeof rewrite === 'function') {
                    ctx.req.url = rewrite(ctx.url);
                }
                proxyServer.web(ctx.req, ctx.res, options)
            })
        }
    }
    proxy(proxies){
        if(proxies){
            proxies.forEach(function(proxy){
                let pattern = new RegExp("^\/"+proxy.context+"(\/|\/\w+)?");
                mildArr.push(Proxy.nginx(
                    "/" + proxy.context,
                    {
                        target: proxy.host,
                        changeOrigin: true,
                        xfwd: true,
                        rewrite: path => path.replace(pattern, ''),
                        logs: true
                    }
                ));
            })
        }
        return compose(mildArr);
    }
}

module.exports = new Proxy;