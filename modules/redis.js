var _ = require('lodash');
var logger = require('./logging.js').logger;
var redis = require('redis');

module.exports.getClient = function() {
    var client = redis.createClient(Money.config.redis.port, Money.config.redis.host);

    if (!_.isNull(Money.config.redis.password))
        client.auth(Money.config.redis.password);

    client.on('ready', function() {
        logger.info('New redis client is ready');
    });

    client.on('error', function(error) {
        logger.info('Redis error. ' + error);
    });

    return client;
}
