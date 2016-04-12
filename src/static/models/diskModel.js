/*
Author:     Oktawiusz Wilk
Date:       10/04/2016
License:    GPL
Purpose:    This file provides encapsulation of the communication between Python server
            and frontend using the Socket.IO channels. It is responsible for interacting
            with the DiskSocket, and provides data required by DiskList and backup restoration
            modal.
*/

AppModule.service("DiskModel", ["socket", function(socket) {
    var DiskModel = {
        data: null,
        status: {
            loading: false
        }
    };

    DiskModel.get = function() {
        this.status.loading = true;
        socket.emit('get:disk', {}, function(){});
    };

    DiskModel.getDisk = function(node, diskName) {
        var disks = DiskModel[node];
        for(var disk in disks) {
            if(disk.name == diskName){
                return disk;
            }
        }
        return null;
    };

    socket.on('get:disk', function(data) {
        DiskModel.data = data;
        DiskModel.status.loading = false;
    });

    return DiskModel;
}]);