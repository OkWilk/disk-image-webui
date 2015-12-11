AppModule.controller("JobInfoCtrl", ['$scope', '$http', '$interval', '$log',
    function($scope, $http, $interval, $log) {
        $scope.update = function() {
            $scope.loading = true;
            $http.get('/job/backup').then(
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

        var intervalUpdate = function() {
            $interval($scope.update, 5000);
        };

        intervalUpdate();
    }
]);
