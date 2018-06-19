## 安装

```bash
$ npm i koa-ngnix --save
```

## 使用

### 中间件，主要代理

```js
const Proxy = require('koa-ngnix');
const Ngnix = new Proxy({
  proxies: [
    {
      host: 'http://localhost:3333/',
      context: 'ngnix'
    },
    {
      host: 'http://localhost:3333/',
      context: 'rewrite',
      rewrite: path => path.replace('rewrite', 'other')
    }
  ]
});
app.use(Ngnix);
```

### 对象传入参数

- `logLevel`
log显示级别。非必填，默认为'info'。
可选参数按照以下级别显示（数字越小级别越大）
```
  error: 0 
  warn: 1 
  info: 2
  verbose: 3 
  debug: 4 
  silly: 5
```

- `proxyTimeout`
全局代理连接超时时间。非必填，单位秒，默认为30000

- `rewrite`
全局url重定向。非必填，Funtion，默认为 path.replace(context, ''), 即当前host。

- `handleReq`
代理前的回调函数，返回一个对象，内部包含proxyReq, req, res, options, log。
```js
const Ngnix = new Proxy({
  proxies: ...,
  handleReq: proxyObj => {
    // log 是koa-ngnix中自带的log，其等级权限跟logLevel一致
    { proxyReq, req, res, options, log } = proxyObj;
  }
});
```

- `handleRes`
代理后的回调函数，返回一个对象，内部包含proxyRes, req, res, log。

- `error`
代理后的回调函数，返回一个对象，内部包含err, req, res, log。