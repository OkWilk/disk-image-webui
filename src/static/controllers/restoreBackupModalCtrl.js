AppModule.controller("RestoreBackupModalCtrl", ['$scope', '$http', '$uibModalInstance', 'MasterModel', 'backup', '$log',
'SizeParser', 'PartitionInfo', function($scope, $http, $uibModalInstance, MasterModel, backup, $log, SizeParser,
PartitionInfo) {

    var initModal = function() {
        MasterModel.update();
        $scope.title = "Restore Backup";
        $scope.model = MasterModel;
        $scope.backup = backup;
        $scope.targetDisk = "";
        $scope.restoration = {
            disk: "",
            node: backup.node,
            job_id: backup.id,
            operation: "Restoration",
            overwrite: false,
            space_check: true,
            fs_check: true,
            crc_check: true,
            force: false
        }
    }

    $scope.selectDisk = function(node, disk) {
        $scope.restoration.disk = disk.name;
        $scope.targetDisk = $scope.getSelectedDisk();
    };
    $scope.isSelectedDisk = function(node, disk) {
        return disk.name + " @ " + node == $scope.getSelectedDisk();
    };
    $scope.getSelectedDisk = function() {
        if($scope.restoration.disk) {
            return $scope.restoration.disk + " @ " + $scope.restoration.node;
        }
        return "";
    };

    $scope.getSubjectivePercentage = SizeParser.getSubjectivePercentage;
    $scope.parseSize = SizeParser.parse;
    $scope.partitionInfo = PartitionInfo.getInfo;

    $scope.cancel = function() {
        $uibModalInstance.dismiss();
    };
    $scope.ok = function() {
        $uibModalInstance.close($scope.restoration)
    };

    initModal();
}])
