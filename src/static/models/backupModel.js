AppModule.service("BackupModel", ["socket", function(socket) {
    var BackupModel = {
        backups: null,
        numberOfPages: 0,
        totalItemCount: 0,
        status: {
            loading: false
        }
    };

    BackupModel.get = function(id, node, deleted, limit, offset, callback) {
        var payload = {
            deleted: deleted,
            offset: offset,
            limit: limit
        };
        if (id) {
            payload.id = id;
        }
        if (node) {
            payload.node = node;
        }
        this.status.loading = true;
        socket.emit('get:backup', payload, function(data){
            data = angular.fromJson(data);
            BackupModel.backups = data.data;
            BackupModel.numberOfPages = Math.ceil(data.total / limit);
            BackupModel.totalItemCount = data.total;
            BackupModel.status.loading = false;
            callback();
        });
    };

    BackupModel.delete = function(backupId, callback) {
        var payload = {
            id: backupId
        };
        socket.emit('delete:backup', payload, callback);
    };

    BackupModel.undelete = function(backupId, callback) {
        var payload = {
            id: backupId
        };
        socket.emit('undelete:backup', payload, callback);
    };

    return BackupModel;
}]);