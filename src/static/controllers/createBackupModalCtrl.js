AppModule.controller("CreateBackupModalCtrl", ['$scope', '$http', '$uibModalInstance', 'node', 'disk', function($scope, $http, $uibModalInstance, node, disk) {
    var initModal = function() {
        $scope.title = "Create Backup";
        $scope.node = node;
        $scope.disk = disk;
        $scope.backup = {
            node: node,
            job_id: "",
            disk: disk.name,
            operation: "Backup",
            compress: true,
            overwrite: false,
            rescue: false,
            space_check: true,
            fs_check: true,
            crc_check: true,
            force: false
        }
    }
    $scope.cancel = function() {
        $uibModalInstance.dismiss();
    }
    $scope.ok = function() {
        $uibModalInstance.close($scope.backup)
    }
    initModal();
}])
