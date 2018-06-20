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
log显示级别。非必填，字符串格式，默认为'info'。
可选参数按照以下级别显示（数字越小级别越大）

logLevel | 级别 |
:--------:|:-----:|
error | 0 
warn | 1 
info | 2
verbose | 3 
debug  | 4 
silly  | 5

- `proxyTimeout`
全局代理连接超时时间。非必填，单位毫秒，Number, 默认为30000

- `rewrite`
全局url重定向。非必填，Funtion，通过改变path返回处理后的url，默认为 path.replace(context, ''), 即当前host。

- `handleReq`
代理前的回调函数，非必填，返回一个对象，内部包含proxyReq, req, res, options, log。
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
代理后的回调函数，非必填，返回一个对象，内部包含proxyRes, req, res, log。

- `error`
代理后的回调函数，非必填，返回一个对象，内部包含err, req, res, log。

- `proxies`
主要参数，必填，必须是以数组形式传递，内部每个对象是个proxy组合，内部某些参数可以覆盖全局同名参数。
  * `target` 代理至的地址，必填, 字符串格式
  * `context` 本地代理根地址，必填，字符串格式
  * `logs` 是否开启log，log级别和logLevel保持一致。非必填，boolean, 默认true
  * `rewrite` 单个proxy重定向，使用同全局rewrite，非必填，Funtion, 如果填有返回值则会覆盖全局rewrite
  * `proxyTimeout` 单个proxy超时时间，使用同全局proxyTimeout，非必填，Number, 如果填有返回值则会覆盖全局proxyTimeout
```js
const Ngnix = new Proxy({
  proxies: [
    {
      target: 'http://127.0.0.1:3000',
      context: 'api',
      logs: false,
      rewrite: path => path.rewrite('api', 'rewriteApi'),
      proxyTimeout: 10000,
    },
    {
      ...
    },
  ],
  proxyTimeout: 5000,
  logLevel: 'debug',
  ...
});
app.use(Ngnix);
```
