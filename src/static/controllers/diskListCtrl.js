AppModule.controller("DiskListCtrl", ['$scope', '$http', '$interval', '$uibModal', '$log', 'SizeParser', 'MasterModel',
    function($scope, $http, $interval, $uibModal, $log, SizeParser, MasterModel) {

    var init = function() {
        $scope.model = MasterModel;
        $scope.parseSize = SizeParser.parse;
        $scope.update()
    }
    $scope.update = function() {
        MasterModel.disks.get();
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
                MasterModel.jobs.post(result)
//                $http.post('/api/' + node + '/job', body).
//                success(function(data, status, headers, config) {
//
//                }).
//                error(function(data, status, headers, config) {
//                    $scope.disks = "error"; // log error
//                });
            },
            function() { }
        );
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
    $scope.isDiskBusy = MasterModel.isDiskBusy;
    init();
}]);
