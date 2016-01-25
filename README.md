![Seneca](http://senecajs.org/files/assets/seneca-logo.png)

> A [Seneca.js][1] AMQP-ready thin wrapper.

# seneca-amqp
Small module that helps create a pre-configured `seneca` ([http://senecajs.org/](http://senecajs.org/)) instance that uses AMQP as its transport layer and has clients and listeners already declared.

[![js-semistandard-style](https://cdn.rawgit.com/flet/semistandard/master/badge.svg)](https://github.com/Flet/semistandard)

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

### Additional features
The `seneca` instance created by this module,
- Uses [seneca-amqp-transport](https://github.com/disintegrator/seneca-amqp-transport) as its transport layer.
- Simplifies configuration of the AMQP broker and declaration of client/listeners to a minimum.
- Defines a new `seneca.pact` method that behaved like a _promesified_ `seneca.act`.
- Disables `'mem-store'` by default. It is assumed that stores are listeners in remote microservice wired up in an AMQP fashion.

> If you need to enable it back, you can pass `{ seneca: { default_plugins: { 'mem-store': false } }` to the configuration object.

## License
MIT

[1]: http://senecajs.org/
