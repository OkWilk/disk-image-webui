/*
Author:     Oktawiusz Wilk
Date:       10/04/2016
License:    GPL
Purpose:    This file wraps the Socket.IO library and exposes interfaces which will be used by the
            rest of models. This abstraction layer allows changing WebSocket library, as long as
            the signatures and the behaviour stays the same.
*/
AppModule.factory('socket', function($rootScope) {
    var socket = io.connect();
    return {
        on: function(event, callback) {
            socket.on(event, function() {
                var args = arguments;
                $rootScope.$apply(function() {
                    callback.apply(socket, args);
                });
            });
        },
        emit: function(event, data, callback) {
            socket.emit(event, data, function() {
                var args = arguments;
                $rootScope.$apply(function() {
                    callback.apply(socket, args);
                });
            });
        }
    };
});
