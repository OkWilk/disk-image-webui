AppModule.controller("JobListCtrl", ['$scope', '$http', '$uibModal', '$interval', '$log', 'MasterModel',
    function($scope, $http, $uibModal, $interval, $log, MasterModel) {

        $scope.model = MasterModel

        $scope.update = function() {
            MasterModel.jobs.get()
        };
        $scope.getProgressValue = function(job) {
            if(job.partitions.length > 0){
                progress = 0
                angular.forEach(job.partitions, function(partition) {
                    progress += parseInt(partition.completed);
                });
                progress /= job.partitions.length;
                return Math.round(progress);
            }
            return 0;
        }
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
        $scope.finishJob = function(node, job) {
            MasterModel.jobs.del(node, job);
        };
        $scope.showDetails = function(node, job) {
            var uibModalInstance = $uibModal.open({
                templateUrl: '/static/modals/jobDetails.html',
                controller: 'JobDetailsModalCtrl',
                size: 'lg',
                resolve: {
                    node: function() {
                        return node;
                    },
                    job: function() {
                        return job;
                    }
                }
            });
        };
    }
]);
