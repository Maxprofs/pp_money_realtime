var winston = require('winston');
var _ = require('lodash');

if (_.isNull(Money.logger)) {
    var transports = [];

    if (Money.config.logging.toConsole) {
        transports.push(
            new (winston.transports.Console)({
                timestamp: true
            })
        );
    }

    if (Money.config.logging.toFile) {
        transports.push(
            new (winston.transports.File)({
                timestamp: true,
                filename: 'logs/money.log',
                json: false
            })
        );
    }

    Money.logger = new (winston.Logger)({
        transports: transports
    });
}

module.exports.logger = Money.logger;
