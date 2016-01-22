# seneca-amqp
[![js-semistandard-style](https://cdn.rawgit.com/flet/semistandard/master/badge.svg)](https://github.com/Flet/semistandard)

Small module that helps create a pre-configured `seneca` (http://senecajs.org/) instance that uses AMQP as its transport layer and has clients and listeners already declared.

```
npm install --save nfantone/seneca-amqp
```

## Usage

You use this module as a direct replacement for `seneca`. The returned instance uses `seneca-amqp-transport` and have clients and listeners already declared.

```javascript
var config = {
   {
       seneca: {
           timeout: 3000
       },
       amqp: {
        hostname: 'dev.rabbitmq.com',
        port: 5672,
        username: 'guest',
        password: 'guest'
       },
       pins: {
           client: ['role:entity', 'cmd:save'],
           listen: ['level:info']
       }
   }
}

var seneca = require('seneca-amqp')(config, function() {
  // This callback is fired on `seneca.ready` (optional)
  // ...
});
```

## License

MIT
