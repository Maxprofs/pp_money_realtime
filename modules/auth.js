'use strict';

var _ = require('lodash');

module.exports = function socketIOAuth(io, config) {
    config = config || {};
    var timeout = config.timeout || 1000;
    var postAuthenticate = config.postAuthenticate || _.noop;

    _.each(io.nsps, forbidConnections);

    io.on('connection', function(socket) {

        socket.auth = false;
        socket.on('authentication', function(data) {

            config.authenticate(data, function(err, result) {
                if (_.isNull(err)) {
                    socket.auth = true;

                    _.each(io.nsps, function(nsp) {
                        restoreConnection(nsp, socket);
                    });

                    socket.emit('authenticated', true);
                    return postAuthenticate(socket, result);
                }
                socket.disconnect();
            });

        });

        setTimeout(function() {
            // If the socket didn't authenticate after connection, disconnect it
            if (!socket.auth) {
                socket.disconnect();
            }
        }, timeout);

    });
};

function forbidConnections(nsp) {
    nsp.on('connect', function(socket) {
        if (!socket.auth) {
            delete nsp.connected[socket.id];
        }
    });
}

function restoreConnection(nsp, socket) {
    if (_.findWhere(nsp.sockets, {id: socket.id})) {
        nsp.connected[socket.id] = socket;
    }
}
