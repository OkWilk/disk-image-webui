AppModule.controller("CreateBackupModalCtrl", ['$scope', '$uibModalInstance', 'node', 'disk', 'toaster', 'MasterModel',
function($scope, $uibModalInstance, node, disk, toaster, MasterModel) {
    var initModal = function() {
        $scope.title = "Create Backup";
        $scope.showErrors = false;
        $scope.node = node;
        $scope.disk = disk;
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
            MasterModel.jobs.post($scope.backup, close);
        } else {
            $scope.showErrors = true;
            toaster.pop('warning','Invalid inputs detected','Fix all errors and try again.')
        }
    };
    var close = function() {
        $uibModalInstance.close();
    };
    initModal();
}]);
