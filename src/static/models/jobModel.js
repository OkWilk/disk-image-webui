AppModule.service("JobModel", ["socket", "toaster", function(socket, toaster) {
    var JobModel = {
        data: {},
        status: {
            loading: false
        }
    };

    JobModel.getJobById = function(node_id, job_id) {
        var selected_job = null;
        angular.forEach(JobModel.data[node_id], function(job, key) {
            if(job.id == job_id) {
                selected_job = job;
            }
        });
        return selected_job;
    };

    JobModel.get = function() {
        JobModel.status.loading = true;
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

    JobModel.post = function(payload, callback) {
        socket.emit('post:job', payload, function(response) {
            if(!response.success) {
                toaster.pop('error', '', response.message)
            } else {
                if(callback) {
                    callback();
                }
            }
        })
    };

    return JobModel;
}]);