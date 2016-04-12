/*
Author:     Oktawiusz Wilk
Date:       10/04/2016
License:    GPL
*/

AppModule.controller("RestoreBackupModalCtrl", ['$scope', '$uibModalInstance', 'MasterModel', 'backup',
    'SizeParser', 'PartitionInfo', '$confirm', 'toaster',
    function($scope, $uibModalInstance, MasterModel, backup, SizeParser, PartitionInfo, $confirm, toaster) {

    var initModal = function() {
        MasterModel.update();
        $scope.title = "Restore Backup";
        $scope.model = MasterModel;
        $scope.backup = backup;
        $scope.selectedDisk = null;
        $scope.validating = false;
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
    };

    $scope.selectDisk = function(node, disk) {
        $scope.restoration.disk = disk.name;
        $scope.targetDisk = $scope.getSelectedDisk();
        $scope.selectedDisk = disk;
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
    $scope.isDiskBusy = MasterModel.isDiskBusy;
    $scope.isSelectedDiskLargeEnough = function() {
        return parseInt($scope.selectedDisk.size) >= parseInt($scope.backup.disk_size);
    };
    $scope.cancel = function() {
        $uibModalInstance.dismiss();
    };
    $scope.ok = function(valid) {
        if(valid) {
             $confirm({title: "Restore backup", text:"Are you sure you want to restore backup '" +
                        $scope.restoration.job_id + "' on " + $scope.restoration.disk +
                        "? \n\nWarning: this operation will overwrite all previous data on this disk."}).then(
            function() {
                $scope.validating = true;
                MasterModel.jobs.post($scope.restoration, callback);
            });
        } else {
            $scope.showErrors = true;
            toaster.pop('warning','Invalid inputs detected','Fix all errors and try again.')
            $scope.validating = false;
        }
    };
    var callback = function(close) {
        if(close) {
            $uibModalInstance.close();
        }
        $scope.validating = false;
    };
    initModal();
}]);