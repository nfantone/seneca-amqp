'use strict';
/**
 * Configures and builds a seneca instance
 * that uses AMQP as its transport, declaring clients
 * and listeners.
 *
 * Expects a configuration object like this:
 *
 * {
 * 	"seneca": {
 * 		"timeout": 3000
 * 	},
 * 	"amqp": {
 *  	"hostname": "dev.rabbitmq.com",
 *  	"port": 5672,
 *  	"username": "guest",
 *  	"password": "guest"
 * 	},
 * 	"pins": {
 * 		"client": ["role:entity", "cmd:save"],
 * 		"listen": ["level:info"]
 * 	}
 * }
 *
 * All attributes are optional. If you don't provide them,
 * sensible defaults will be used.
 *
 * Also, monkey-patches `seneca.act` to return a Promise
 * if no callback is provided.
 *
 * @author nfantone
 */

var util = require('util');
var seneca = require('seneca');
var Promise = require('bluebird');

function setup(method, config) {
  var pins = config.pins[method];
  pins = util.isArray(pins) ? pins : [pins];
  if (pins && pins.length) {
    pins.forEach(function(pin) {
      var options = JSON.parse(JSON.stringify(config.amqp));
      options.pin = pin;
      seneca[method](options);
    });
  }
  return seneca;
}

module.exports = function(config, cb) {
  config = config || {};
  seneca = seneca(config.seneca)
    .use('amqp-transport');

  var cact = seneca.act;
  var pact = Promise.promisify(seneca.act, { context: seneca });
  seneca.act = function(input, cb) {
    if (util.isFunction(cb)) {
      return cact(input, cb);
    }
    return pact(input);
  };

  if (config.pins) {
    setup('listen', config);
    setup('client', config);
  }
  if (util.isFunction(cb)) {
    seneca.ready(cb);
  }
  return seneca;
};
