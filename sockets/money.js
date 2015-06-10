var _ = require('lodash');
var redisFactory = require('../modules/redis.js');
var logger = require('../modules/logging.js').logger;

var clients = {};

var subscribeRedisClient = redisFactory.getClient();
var onlineRedisClient = redisFactory.getClient();

subscribeRedisClient.on('message', function(channel, message) {
    try {
        messageData = JSON.parse(message);
    } catch(error) {
        return logger.error('Invalid redis message. ' + error);
    }

    if (channel == 'BROADCAST') {

        io.emit('socket:' + messageData.type, messageData.data);

    } else {

        var clientId = channel.replace('MONEY|', '');
        var client = clients[ clientId ];
        if (_.isUndefined(client))
            return;
        _.forEach(clients[ clientId ].sockets, function(socket) {
            socket.emit('socket:' + messageData.type, messageData.data);
        });

        if (messageData.type == 'disconnect') {
            _.forEach(clients[ clientId ].sockets, function(socket) {
                socket.disconnect();
            });
        }

    }
});

module.exports.addSocket = function(socket, tokenData) {
    if (_.isUndefined( clients[ tokenData.user_id ] ) || _.isNull( clients[ tokenData.user_id ] )) {
        clients[ tokenData.user_id ] = {
            sockets: []
        };
    }

    socket.tokenData = tokenData;
    clients[ tokenData.user_id ].sockets.push(socket);

    if (clients[ tokenData.user_id ].sockets.length == 1) {
        onlineRedisClient.set('MONEY|' + tokenData.user_id + '|ONLINE', '1');
        subscribeRedisClient.subscribe('MONEY|' + tokenData.user_id);
    }

    socket.on('disconnect', function() {
        if (!_.isUndefined( clients[ tokenData.user_id ] )) {
            _.pull(clients[ tokenData.user_id ].sockets, socket);

            if (clients[ tokenData.user_id ].sockets.length == 0) {
                delete clients[ tokenData.user_id ];
                subscribeRedisClient.unsubscribe('MONEY|' + tokenData.user_id);
                onlineRedisClient.set('MONEY|' + tokenData.user_id + '|ONLINE', '0');
            }
        }
    });
}
