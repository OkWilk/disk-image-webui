AppModule.controller("MountListCtrl", ['$scope', '$uibModal', '$log', 'MasterModel',
    function($scope, $uibModal, $log, MasterModel) {

    var init = function() {
        $scope.model = MasterModel;
        $scope.update()
    }
    $scope.update = function() {
        MasterModel.mounts.get();
    }

    $scope.unmount = function(node, mount) {
        MasterModel.mounts.unmount(node, mount)
    }
    init();
}]);
