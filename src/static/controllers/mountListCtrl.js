AppModule.controller("MountListCtrl", ['$scope', '$uibModal', '$log', 'MasterModel',
    function($scope, $uibModal, $log, MasterModel) {

    var init = function() {
        $scope.model = MasterModel;
    }
    $scope.update = function() {
        MasterModel.mounts.get();
    }

    $scope.unmount = function(node, mount) {
        $log.info(node);
        $log.info(mount);
        MasterModel.mounts.unmount(node, mount)
    }
    init();
}]);
