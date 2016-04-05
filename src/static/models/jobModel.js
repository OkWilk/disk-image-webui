AppModule.service("JobModel", ["$log", "socket", "toaster", function($log, socket, toaster) {
    var JobModel = {
        data: {},
        status: {
            loading: false
        }
    };

    JobModel.get = function() {
        status.loading = true;
        socket.emit('get:job', {}, function(){});
    };

    socket.on('get:job', function(data) {
        JobModel.data = data;
        JobModel.status.loading = false;
    });

    JobModel.del = function(node, job) {
        payload = {
            node: node,
            job_id: job.id
        };
        socket.emit('delete:job', payload, function(response) {
            if(!response.success) {
               toaster.pop('warning', '', response.message)
            }
        });
    };

    JobModel.post = function(payload) {
        socket.emit('post:job', payload, function(response) {
            $log.info(response);
            if(response.f) {
                toaster.pop('error', '', response.message)
            }
        })
    };

    JobModel.get();

    return JobModel;
}]);