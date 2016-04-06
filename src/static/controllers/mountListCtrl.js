AppModule.controller("MountListCtrl", ['$scope', '$uibModal', 'MasterModel', function($scope, $uibModal, MasterModel) {

    var init = function() {
        $scope.model = MasterModel;
    };
    $scope.update = function() {
        MasterModel.mounts.get();
    };

    $scope.unmount = function(node, mount) {
        MasterModel.mounts.unmount(node, mount)
    };
    init();
}]);
