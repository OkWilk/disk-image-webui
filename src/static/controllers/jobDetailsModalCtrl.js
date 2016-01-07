AppModule.controller("JobDetailsModalCtrl", ['$scope', '$uibModalInstance', 'node', 'job',
    function($scope, $uibModalInstance, node, job) {
        var initModal = function() {
            $scope.node = node;
            $scope.job = job;
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

        $scope.cancel = function() {
            $uibModalInstance.dismiss();
        }
        initModal();
    }
]);
