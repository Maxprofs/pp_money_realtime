var logger = require('../modules/logging.js').logger;
var db = require('../modules/db.js');
var money = require('./money');
var moment = require('moment');

function authenticate(data, callback) {
    var now = moment.utc()
    db.query('SELECT * FROM `brain_accounts_sockettoken` WHERE `token`=? AND `expired`>?',
        [data, now._d]
    ).then(function(rows) {
        if (rows.length == 1) {
            callback(null, rows[0]);
        } else {
            callback('Not valid token', null);
        }
    });
}

function postAuthenticate(socket, data) {
    money.addSocket(socket, data);
}

module.exports = function(io) {
    'use strict';

    require('../modules/auth.js')(io, {
        authenticate: authenticate,
        postAuthenticate: postAuthenticate,
        timeout: 3000
    });
};
