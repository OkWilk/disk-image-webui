AppModule.controller("DiskInfoCtrl", ['$scope', '$http', '$interval', '$log', function($scope, $http, $interval, $log) {
    $scope.getDiskInfo = function() {
        $http.get('api/disk').
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
        body = {
            "node": node,
            "job_id": disk,
            "source": disk,
            "overwrite": true,
            "compress": true
        }
        $http.post('/job/backup', body).
        success(function(data, status, headers, config) {

        }).
        error(function(data, status, headers, config) {
            $scope.disks = "error"; // log error
        });
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
        info += "<br/><b>Size: </b>" + partition.size / 1024 + " MB</p>"
        return info
    }
    $scope.status = {
        open: false,
        updating: true,
        countdown: 1
    };
    intervalUpdate();
}]);
