AppModule.service("MountModel", ["$log","socket", "toaster", function($log, socket, toaster) {
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
                for(i in mounts) {
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
            response = response.trim();
            if(response === 'OK') {
                toaster.pop('success', '', 'Backup "' + payload.backup_id + '" was successfully unmounted on ' +
                            payload.node_id);
            } else {
                toaster.pop('error', '', response)
            }
        })
    };

    MountModel.mount = function(backup) {
        var payload = {
            node_id: backup.node,
            backup_id: backup.id
        };
        socket.emit('post:mount', payload, function(response) {
            response = response.trim();
            if(response === "OK") {
                toaster.pop('success', '', 'Backup "' + payload.backup_id + '" was successfully mounted on ' +
                            payload.node_id);
            } else {
                toaster.pop('error', '', 'Failed to mount backup "' + payload.backup_id + '" on ' + payload.node_id, 0);
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

    MountModel.get();

    return MountModel;
}]);