![Seneca](http://senecajs.org/files/assets/seneca-logo.png)

[![js-semistandard-style](https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg?style=flat-square)](https://github.com/Flet/semistandard)

> A [Seneca.js][1] AMQP-ready thin wrapper.

# seneca-amqp
Small module that helps create a pre-configured `seneca` ([http://senecajs.org/](http://senecajs.org/)) instance that uses AMQP as its transport layer and eases declaration of clients and listeners.


```
npm install --save seneca-amqp
```

## Usage
You use this module as a direct replacement for `seneca`, which is declared in `peerDependencies` (so you can install the version you need). The returned instance uses `seneca-amqp-transport` and has a `.start` function that'll declare listeners and clients for you (no need to call `.listen` or `.client`).

```javascript
var config = {
   seneca: {
     // Any global seneca option
    timeout: 3000
   },
   amqp: {
    // Broker connection settings
    hostname: 'dev.rabbitmq.com',
    port: 5672,
    username: 'guest',
    password: 'guest'
   },
   pins: {
    // Pins used in .client and .listen methods
    client: 'role:entity,cmd:save',
    listen: ['level:info', 'cmd:rollback,proc:status']
  },
  autoStart: false
};

var seneca = require('seneca-amqp')(config);
seneca.start()
  .then(() => console.log('Seneca is ready'))
  .catch(console.error);
```

### Additional features
The `seneca` instance created by this module,
- Uses [seneca-amqp-transport](https://github.com/disintegrator/seneca-amqp-transport) as its transport layer. There's no need to declare it as en explicit dependency: this module will do that for you.
- Simplifies configuration of the AMQP broker and declaration of client/listeners to a minimum.
- Defines a new `seneca.actAsync` method that behaves like a _promisified_ `seneca.act`.

> In previous versions this was named `seneca.pact`. That is now _deprecated_. Please, use `seneca.actAsync` instead.

- Adds a new `seneca.start` method that returns a promise that fulfills when all clients and listeners have been declared and fired up.
- Disables `'mem-store'` by default. It is assumed that stores are listeners in remote microservice wired up in an AMQP fashion.

> If you need to enable it back, you can pass `{ seneca: { default_plugins: { 'mem-store': true } }` to the configuration object.

## License
MIT

[1]: http://senecajs.org/
