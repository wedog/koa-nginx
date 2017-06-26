``# koa-nginx

[![npm version](https://badge.fury.io/js/koa-nginx.svg)](https://badge.fury.io/js/koa-nginx) [![Build Status](https://www.travis-ci.org/wedog/koa-nginx.svg?branch=master)](https://www.travis-ci.org/wedog/koa-nginx) [![Coverage Status](https://coveralls.io/repos/github/wedog/koa-nginx/badge.svg?branch=master)](https://coveralls.io/github/wedog/koa-nginx?branch=master)

Reverse proxy middleware for koa. Proxy resources on other servers, such as Java services, and other node.js applications. Based on http-proxy library.

# Installation

First install node.js(v7.6.0 or higher). Then:

```
npm install koa-nginx --save

```

# Usage
When you request url contains terminal, it will transmit to http://127.0.0.1:3000/ !

```
const koa         = require('koa');
const bodyParser  = require('koa-bodyparser');
const koaNginx    = require('koa-nginx');

const app = new koa();
const options = [{
    "host": "http://127.0.0.1:3000/",
    "context": "terminal"
}];
app.use(koaNginx.proxy(options));
//the bodyParser middleware must be after koa-nginx
app.use(bodyParser());
let server = app.listen();
    
```

# License
MIT License

Copyright (c) 2017 yong.liu

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

