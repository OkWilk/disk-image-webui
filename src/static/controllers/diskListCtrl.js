AppModule.controller("DiskListCtrl", ['$scope', '$http', '$interval', '$uibModal', '$log', 'SizeParser', 'MasterModel',
    'PartitionInfo', function($scope, $http, $interval, $uibModal, $log, SizeParser, MasterModel, PartitionInfo) {

    var init = function() {
        $scope.model = MasterModel;
        $scope.parseSize = SizeParser.parse;
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
            },
            function() { }
        );
    }
    $scope.getSubjectivePercentage = SizeParser.getSubjectivePercentage;
    $scope.partitionInfo = PartitionInfo.getInfo;
    $scope.isDiskBusy = MasterModel.isDiskBusy;
    init();
}]);
