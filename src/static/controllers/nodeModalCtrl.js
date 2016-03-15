AppModule.controller("NodeModalCtrl", ["$scope", "$uibModalInstance", "node", "NodeModel",
    function($scope, $uibModalInstance, node, NodeModel) {
    var init_modal = function() {
        if(node) {
            $scope.title = "Edit node";
            $scope.node = node;
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
    $scope.addIgnoredDisk = function() {
        var index = $scope.node.ignored_disks.indexOf($scope.ignored);
        if(index < 0 && $scope.ignored) {
            $scope.node.ignored_disks.push($scope.ignored);
            $scope.ignored = "";
        }
    };
    $scope.ok = function() {
        if($scope.edit) {
            updateNode($scope.node);
        } else {
            createNode($scope.node);
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
