require('./config/config.js');
require('./modules/db.js');
require('./modules/redis.js');

var fs = require('fs');
var logger = require('./modules/logging.js').logger;

if (Money.config.server.secure) {
    var server = require('https').createServer(Money.config.server.options);
} else {
    var server = require('http').createServer(Money.config.server.options);
}
var io = require('socket.io')(server, Money.config.io.serverOptions);

require('./sockets/base.js')(io);

server.listen(Money.config.io.port);
logger.info('Server listen on ' + Money.config.io.port + ' port');
