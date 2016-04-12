/*
Author:     Oktawiusz Wilk
Date:       10/04/2016
License:    GPL
*/

AppModule.controller("CreateBackupModalCtrl", ['$scope', '$uibModalInstance', 'node', 'disk', 'toaster', 'MasterModel',
function($scope, $uibModalInstance, node, disk, toaster, MasterModel) {
    var initModal = function() {
        $scope.title = "Create Backup";
        $scope.showErrors = false;
        $scope.node = node;
        $scope.disk = disk;
        $scope.validating = false;
        $scope.backup = {
            node: node,
            job_id: "",
            disk: disk.name,
            operation: "Backup",
            compress: false,
            overwrite: false,
            rescue: false,
            space_check: true,
            fs_check: true,
            crc_check: true,
            force: false
        }
    };
    $scope.cancel = function() {
        $uibModalInstance.dismiss();
    };
    $scope.ok = function(valid) {
        if(valid) {
            $scope.validating = true;
            MasterModel.jobs.post($scope.backup, callback);
        } else {
            $scope.showErrors = true;
            toaster.pop('warning','Invalid inputs detected','Fix all errors and try again.')

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
