/*
Author:     Oktawiusz Wilk
Date:       10/04/2016
License:    GPL
Purpose:    This file provides encapsulation of the communication between Python server
            and frontend using the Socket.IO channels. It is responsible for interacting
            with the MountSocket, and provides data required by BackupList and MountListController.
*/
AppModule.service("MountModel", ["socket", "toaster", function( socket, toaster) {
    var MountModel = {
        data: null,
        status: {
            loading: false
        }
    };

    MountModel.get = function() {
        this.status.loading = true;
        socket.emit('get:mount', {}, function(){});
    };

    MountModel.getMount = function(node, mountId) {
        if(MountModel.data) {
            var mounts = MountModel.data[node];
            if(mounts) {
                for(var i in mounts) {
                    if(mounts[i].id === mountId) {
                        return mounts[i];
                    }
                }
            }
        }
        return null;
    };

    MountModel.unmount = function(node, backupId) {
        var payload = {
            node_id: node,
            backup_id: backupId
        };
        socket.emit('delete:mount', payload, function(response) {
            if(response.success) {
                toaster.pop('success', '', 'Backup "' + payload.backup_id + '" was successfully unmounted on ' +
                            payload.node_id);
            } else {
                toaster.pop('error', '', response.message)
            }
        })
    };

    MountModel.mount = function(backup) {
        var payload = {
            node_id: backup.node,
            backup_id: backup.id
        };
        socket.emit('post:mount', payload, function(response) {
            if(response.success) {
                toaster.pop('success', '', 'Backup "' + payload.backup_id + '" was successfully mounted on ' +
                            payload.node_id);
            } else {
                toaster.pop('error', '', response.message, 0);
            }
        })
    };

    MountModel.isMounted = function(backup) {
        return MountModel.getMount(backup.node, backup.id) != null;
    };

    socket.on('get:mount', function(data) {
        MountModel.data = data;
        MountModel.status.loading = false;
    });

    return MountModel;
}]);