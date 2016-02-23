AppModule.service("JobModel", ["$log", "socket", "toaster", function($log, socket, toaster) {
    JobModel = {
        data: {},
        status: {
            loading: false
        }

    }
    JobModel.get = function() {
        status.loading = true;
        socket.emit('get:job', {}, function(){});
    }

    socket.on('get:job', function(data) {
        JobModel.data = data;
        JobModel.status.loading = false;
    });

    JobModel.del = function(node, job) {
        payload = {
            node_id: node,
            job_id: job.id
        };
        socket.emit('delete:job', payload, function(response) {
            $log.info(response) // TODO: implement notification system!
        });
    }

    JobModel.post = function(payload) {
        socket.emit('post:job', payload, function(response) {
            $log.info(response)
            if(response.error) {
                toaster.pop('error', '', response.message)
            }
        })
    }

    JobModel.get();

    return JobModel;
}])