AppModule.service("MountModel", ["$log","socket", function($log, socket) {
    MountModel = {
        data: null,
        status: {
            loading: false
        }
    }

    MountModel.get = function() {
        this.status.loading = true;
        socket.emit('get:mount', {}, function(){});
    }

    MountModel.getMount = function(node, mountName) {
        mounts = MountModel[node];
        for(mount in mounts) {
            if(mount.name == mountName){
                return mount;
            }
        }
        return null;
    };

    MountModel.unmount = function(node, mount) {
        payload = {
            node_id: node,
            backup_id: mount.id
        }
        socket.emit('delete:mount', payload, function(response) {})
    }
    socket.on('get:mount', function(data) {
        MountModel.data = data;
        MountModel.status.loading = false;
    });

    return MountModel;
}])