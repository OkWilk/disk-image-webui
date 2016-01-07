AppModule.controller("DiskListCtrl", ['$scope', '$http', '$interval', '$uibModal', '$log', function($scope, $http, $interval, $uibModal, $log) {
    $scope.humanSize = function(bytes) {
        var threshold = 1024;
        if(Math.abs(bytes) < threshold) {
            return bytes + ' B';
        }
        var units = ['kB','MB','GB','TB','PB','EB','ZB','YB'];
        var unitIndex = -1;
        do {
            bytes /= threshold;
            ++unitIndex;
        } while(Math.abs(bytes) >= threshold && unitIndex < units.length - 1);
        return bytes.toFixed(1)+' '+units[unitIndex];
    };

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
        percentage = Math.floor((size / total) * 100)
        if (percentage < 1) {
            return 0.5 + "%"
        } else {
            return percentage + "%"
        }
    }
    $scope.partitionInfo = function(partition) {
        info = "<p><b>File-system:</b> "
        if (partition.fs != "") {
            info += partition.fs
        } else {
            info += "raw"
        }
        info += "<br/><b>Size: </b>" + $scope.humanSize(partition.size) + "</p>"
        return info
    }
    $scope.status = {
        open: false,
        updating: true,
        countdown: 1
    };
    intervalUpdate();
    $scope.update()
}]);
