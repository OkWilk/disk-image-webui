AppModule.service("MasterModel", ["DiskModel", "JobModel", "MountModel", "MetricModel", "NodeModel",
    function(DiskModel, JobModel, MountModel, MetricModel, NodeModel) {

    var MasterModel = {
        jobs: JobModel,
        mounts: MountModel,
        disks: DiskModel,
        metrics: MetricModel,
        nodes: NodeModel
    };

    MasterModel.update = function() {
        MasterModel.disks.get();
        MasterModel.jobs.get();
        MasterModel.mounts.get();
        MasterModel.metrics.get();
        MasterModel.nodes.get();
    };

    MasterModel.isDiskBusy = function(node, disk) {
        if(MasterModel.jobs.data) {
            var current_jobs = MasterModel.jobs.data[node];
            var i = 0;
            while(current_jobs && i < current_jobs.length){
                var job = current_jobs[i];
                if(job.disk == disk.name && job.status == "running") {
                    return true;
                }
                ++i;
            }
            return false;
        }
    };

    MasterModel.update();
    return MasterModel;
}]);