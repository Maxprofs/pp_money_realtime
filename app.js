require('./config/config.js');
require('./modules/db.js');
require('./modules/redis.js');

var logger = require('./modules/logging.js').logger;
var server = require('http').createServer();
var io = require('socket.io')(server, Money.config.io.serverOptions);

require('./sockets/base.js')(io);

server.listen(Money.config.io.port);
logger.info('Server listen on ' + Money.config.io.port + ' port');
