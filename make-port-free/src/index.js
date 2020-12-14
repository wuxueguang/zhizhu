'use strict';

var net = require('net');

module.exports = function (port) {

    return new Promise(function(resolve, reject) {

        var server = net.createServer();

        server.once('error', function (err) {

            if (err.code === 'EADDRINUSE' || err.code === 'EACCES') {
                reject(new Error('port in use'));
            }
        });

        server.once('listening', function () {

            server.once('close', function () {
                resolve(port);
            });

            server.close();
        });

        server.listen(port);
    });

};