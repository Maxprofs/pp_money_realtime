var mysql = require('mysql');
var Q = require('q');
var _ = require('lodash');
var logger = require('./logging.js').logger;


if (_.isNull(Money.db.pool) || _.isUndefined(Money.db.pool)) {
    logger.info('Create MySQL pool');
    Money.db.pool = mysql.createPool(Money.config.db);
}

module.exports.query = function(query, params) {
    'use strict';

    return Q.Promise(function(resolve, reject, notify) {

        Money.db.pool.getConnection(function(error, connection) {

            if (error) {
                logger.error('Error in connection database. ' + error);
                connection.release();
                return reject(error);
            }

            connection.on('error', function(error) {
                logger.error('Error in connection database. ' + error);
                connection.release();
                return reject(error);
            });

            connection.query(query, params, function(error, results, fields) {
                if (error) {
                    logger.error('Error in query to database. Query: ' + query + '. Error: ' + error);
                    connection.release();
                    return reject(error);
                }

                resolve(results);
            });

        });

    });

}
