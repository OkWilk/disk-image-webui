AppModule.service("BackupModel", ["$log","socket", function($log, socket) {
    BackupModel = {
        backups: null,
        numberOfPages: 0,
        totalItemCount: 0,
        status: {
            loading: false
        }
    }

    BackupModel.get = function(id, node, deleted, limit, offset, callback) {
        payload = {
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
            BackupModel.backups = data.data;
            BackupModel.numberOfPages = Math.ceil(data.total / limit);
            BackupModel.totalItemCount = data.total;
            BackupModel.status.loading = false;
            callback();
        });
    }

    BackupModel.delete = function(backupId, callback) {
        payload = {
            id: backupId
        }
        socket.emit('delete:backup', payload, callback);
    }

    return BackupModel;
}])