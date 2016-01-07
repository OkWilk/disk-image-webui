AppModule.controller("JobListCtrl", ['$scope', '$http', '$uibModal', '$interval', '$log',
    function($scope, $http, $uibModal, $interval, $log) {
        $scope.status = {
            loading: false
        };
        $scope.update = function() {
            $scope.status.loading = true;
            $http.get('/api/job').then(
                function(response) {
                    $scope.jobs = response.data;
                    $scope.status.loading = false;
                },
                function(reason) {
                    $scope.error = "Could not fetch job data.";
                }
            );
        };
        $scope.getProgressValue = function(job) {
            if(job.partitions.length > 0){
                progress = 0
                angular.forEach(job.partitions, function(partition) {
                    progress += parseInt(partition.completed);
                });
                progress /= job.partitions.length;
                return progress;
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
        $scope.finishJob = function(node, jobId) {
            $http.delete('/api/' + node + '/job/' + jobId).then(
                function(response) {
                    $scope.update();
                },
                function(reason) {
                    $scope.error = "Could not finish job.";
                }
            );
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
        var intervalUpdate = function() {
            $interval($scope.update, 3000);
        };

        intervalUpdate();
        $scope.update();
    }
]);
