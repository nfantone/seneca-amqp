'use strict';
/**
 * Configures and builds a seneca instance
 * that uses AMQP as its transport.
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
 * 		"client": ["role:entity", "cmd:save"]
 * 		"listen": ["level:info"]
 * 	}
 * }
 *
 * All attributes are optional. If you don't provide them,
 * sensible defaults will be used.
 * 
 * @author nfantone
 */

var seneca = require('seneca')

function setup(method, config) {
  var pins = config.pins[method];
  if (pins && pins.length) {
    pins.forEach(function (pin) {
      config.amqp.pin = pin;
      seneca[method](config);
    });
  }
  return seneca;
}

module.exports = function (config) {
  seneca(config.seneca)
  .use('amqp-transport');

  if (config.pins) {
    setup('listen', config);
    setup('client', config);
  }
  return seneca;
}
