AppModule.service("DiskModel", ["$log","socket", function($log, socket) {
    DiskModel = {
        data: null,
        status: {
            loading: false
        }
    }

    DiskModel.get = function() {
        this.status.loading = true;
        socket.emit('get:disk', {}, function(){});
    }

    DiskModel.getDisk = function(node, diskName) {
        disks = DiskModel[node];
        for(disk in disks) {
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
}])