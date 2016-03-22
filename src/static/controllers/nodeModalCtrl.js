AppModule.controller("NodeModalCtrl", ["$scope", "$uibModalInstance", "node", "NodeModel", "toaster",
    function($scope, $uibModalInstance, node, NodeModel, toaster) {
    var init_modal = function() {
        if(node) {
            $scope.title = "Edit node";
            $scope.node = node;
            $scope.showErrors = false;
            $scope.edit = true;
        } else {
            $scope.title = "Add node";
            $scope.node = {
                name: "",
                address: "",
                port: 5000,
                enabled: true,
                ignored_disks: []
            };
            $scope.edit = false;
        }
    };
    $scope.removeIgnoredDisk = function(disk) {
        var index = $scope.node.ignored_disks.indexOf(disk);
        if(index > -1) {
            $scope.node.ignored_disks.splice(index, 1);
        }
    };
    $scope.canAddDiskToIgnoreList = function() {
        var index = $scope.node.ignored_disks.indexOf($scope.ignored);
        if(index < 0 && $scope.ignored) {
            return true;
        } else {
            return false;
        }
    };
    $scope.addIgnoredDisk = function() {
        if($scope.canAddDiskToIgnoreList()) {
            $scope.node.ignored_disks.push($scope.ignored);
            $scope.ignored = "";
        }
    };
    $scope.ok = function(valid) {
        if(valid) {
            if ($scope.edit) {
                updateNode($scope.node);
            } else {
                createNode($scope.node);
            }
        } else {
            $scope.showErrors = true;
            toaster.pop('warning','Invalid inputs detected','Fix all errors and try again.')
        }
    };
    $scope.cancel = function() {
        $uibModalInstance.dismiss();
    };
    var updateNode = function(node) {
        NodeModel.update(node, closeModal());
    };
    var createNode = function(node) {
        NodeModel.add(node, closeModal);
    };
    var closeModal = function() {
        $uibModalInstance.close();
    };

    init_modal();
}]);
