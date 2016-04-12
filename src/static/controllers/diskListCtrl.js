/*
Author:     Oktawiusz Wilk
Date:       10/04/2016
License:    GPL
*/

AppModule.controller("DiskListCtrl", ['$scope', '$uibModal', 'SizeParser', 'MasterModel',
    'PartitionInfo', function($scope, $uibModal, SizeParser, MasterModel, PartitionInfo) {

    var init = function() {
        $scope.model = MasterModel;
        $scope.parseSize = SizeParser.parse;
    };
    $scope.update = function() {
        MasterModel.disks.get();
    };
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
    };
    $scope.getSubjectivePercentage = SizeParser.getSubjectivePercentage;
    $scope.partitionInfo = PartitionInfo.getInfo;
    $scope.isDiskBusy = MasterModel.isDiskBusy;
    init();
}]);
