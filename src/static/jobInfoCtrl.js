AppModule.controller("JobInfoCtrl", ['$scope', '$http', '$interval', '$log',
    function($scope, $http, $interval, $log) {
        $scope.update = function() {
            $scope.loading = true;
            $http.get('/api/job').then(
                function(response) {
                    $scope.jobs = response.data;
                    $scope.loading = false;
                },
                function(reason) {
                    $scope.error = "Could not fetch job data.";
                }
            );
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

        $scope.finishJob = function(node, jobId) {
            $http.delete('/api/' + node + '/job/' + jobId).then(
                function(response) {
                    $scope.jobs.pop(jobId);
                    $scope.update()
                },
                function(reason) {
                    $scope.error = "Could not finish job.";
                }
            );
        };

        var intervalUpdate = function() {
            $interval($scope.update, 5000);
        };

        intervalUpdate();
    }
]);
