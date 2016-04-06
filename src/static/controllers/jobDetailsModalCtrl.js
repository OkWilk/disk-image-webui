AppModule.controller("JobDetailsModalCtrl", ['$scope', '$uibModalInstance', 'node', 'job', 'MasterModel',
    function($scope, $uibModalInstance, node, job, MasterModel) {
        var initModal = function() {
            $scope.model = MasterModel;
            $scope.nodeId = node;
            $scope.jobId = job.id;
        };

        $scope.job = function() {
            return $scope.model.jobs.getJobById($scope.nodeId, $scope.jobId);
        };

        $scope.getProgressType = function(type) {
            switch (type) {
                case 'finished':
                    return 'success';
                case 'running':
                    return 'primary';
                case 'error':
                    return 'danger';
                default:
                    return 'warning';
            }
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss();
        };

        initModal();
    }
]);
