AppModule.service("MasterModel", ["DiskModel", "JobModel", "MountModel", "MetricModel",
    function(DiskModel, JobModel, MountModel, MetricModel) {

    MasterModel = {
        jobs: JobModel,
        mounts: MountModel,
        disks: DiskModel,
        metrics: MetricModel
    }

    MasterModel.update = function() {
        MasterModel.jobs.get();
        MasterModel.mounts.get();
        MasterModel.disks.get();
        MasterModel.metrics.get();
    }

    MasterModel.isDiskBusy = function(node, disk) {
        if(MasterModel.jobs.data) {
            current_jobs = MasterModel.jobs.data[node];
            i = 0;
            while(current_jobs && i < current_jobs.length){
                job = current_jobs[i];
                if(job.disk == disk.name && job.status == "running") {
                    return true;
                }
                ++i;
            }
            return false;
        }
    };

    return MasterModel;
}])