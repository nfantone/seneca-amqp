'use strict';
/**
 * Configures and builds a seneca instance
 * that uses AMQP as its transport, declaring clients
 * and listeners.
 *
 * Expects a configuration object like this:
 *
 * {
 *   "seneca": {
 *   "timeout": 3000
 *   },
 *   "amqp": {
 *     "hostname": "dev.rabbitmq.com",
 *      "port": 5672,
 *      "username": "guest",
 *      "password": "guest"
 *   },
 *   "pins": {
 *     "client": ["role:entity", "cmd:save"],
 *     "listen": ["level:info"]
 *   },
 *   "autoStart": true
 * }
 *
 * All attributes are optional. If you don't provide them,
 * sensible defaults will be used.
 *
 * Also, adds `seneca.actAsync` method as promisified `seneca.act` and
 * disables 'mem-store' by default.
 *
 * @module seneca-amqp
 */

var seneca = require('seneca');
const util = require('util');
const Promise = require('bluebird');
const defaults = require('lodash.defaultsdeep');
const castarray = require('lodash.castarray');

// Disable mem-store by default. It is assumed that stores
// are defined in a remote AMQP microservice. You can enable
// it back, if needed.
const DEFAULTS = {
  seneca: {
    default_plugins: {
      'mem-store': false
    }
  },
  autoStart: false
};

// Module API
module.exports = initialize;

function clone(o) {
  try {
    return JSON.parse(JSON.stringify(o));
  } catch (e) {
    return undefined;
  }
}

function setup(method, config) {
  var pins = config.pins[method];
  if (pins) {
    pins = castarray(pins);
    if (pins.length > 0) {
      pins.forEach(function(pin) {
        var options = clone(config.amqp);
        options.pin = pin;
        options.type = 'amqp';
        seneca[method](options);
      });
    }
  }
  return seneca;
}

function start(config) {
  return function() {
    if (config.pins) {
      setup('listen', config);
      setup('client', config);
    }

    return Promise.promisify(seneca.ready, {
      context: seneca
    })();
  };
}

function initialize(config, cb) {
  cb = util.isFunction(cb) ? cb : Function.prototype;
  config = defaults(clone(config), DEFAULTS);
  seneca = seneca(config.seneca)
    .use(require('seneca-amqp-transport'));

  seneca.actAsync = Promise.promisify(seneca.act, {
    context: seneca
  });

  seneca.start = start(config);

  if (config.autoStart) {
    seneca.start()
      .then(cb, cb);
  }
  return seneca;
}
