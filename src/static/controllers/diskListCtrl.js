AppModule.controller("DiskListCtrl", ['$scope', '$http', '$interval', '$uibModal', '$log', 'SizeParser',
    function($scope, $http, $interval, $uibModal, $log, SizeParser) {

    var init = function() {
        $scope.parseSize = SizeParser.parse;
        $scope.status = {
            open: false,
            updating: true,
            countdown: 1
        };
        intervalUpdate();
        $scope.update()
    }
    $scope.getDiskInfo = function() {
        $http.get('/api/disk').
        success(function(data, status, headers, config) {
            $scope.disks = data;
            $scope.status.loading = false;
        }).
        error(function(data, status, headers, config) {
            $scope.disks = "error"; // log error
            $scope.status.loading = false;
        });
    }
    $scope.backup = function(node, disk) {
        var uibModalInstance = $uibModal.open({
            templateUrl: '/static/modals/createBackup.html',
            controller: 'CreateBackupModalCtrl',
            backdrop: 'static',
            resolve: {
                node: function() {
                    return angular.copy(node);
                },
                disk: function() {
                    return angular.copy(disk);
                }
            }
        });
        uibModalInstance.result.then(
            function(result) {
                body = result
                $http.post('/api/' + node + '/job', body).
                success(function(data, status, headers, config) {

                }).
                error(function(data, status, headers, config) {
                    $scope.disks = "error"; // log error
                });
            },
            function() { }
        );
    }
    $scope.update = function() {
        $scope.status.loading = true;
        $scope.getDiskInfo()
    }
    var intervalUpdate = function() {
        $interval($scope.update, 10000);
    }
    $scope.getPercentage = function(size, total) {
        percentage = Math.floor((size / total) * 100);
        if(percentage < 1) {
            return 1 + "%";
        } else if (percentage > 25) {
            return (percentage - 1) + "%";
        } else {
            return percentage + "%";
        }
    }
    $scope.partitionInfo = function(partition) {
        info = "<p><b>File-system:</b> "
        if (partition.fs != "") {
            info += partition.fs
        } else {
            info += "raw"
        }
        info += "<br/><b>Size: </b>" + SizeParser.parse(partition.size) + "</p>"
        return info
    }
    init();
}]);
