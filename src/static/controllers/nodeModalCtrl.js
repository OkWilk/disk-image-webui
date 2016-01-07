AppModule.controller("NodeModalCtrl", ["$scope", "$uibModalInstance", "$http", "node", function($scope, $uibModalInstance, $http, node) {
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
        console.log('Removing: ' + disk);
        index = $scope.node.ignored_disks.indexOf(disk);
        if(index > -1) {
            $scope.node.ignored_disks.splice(index, 1);
        }
    };
    $scope.addIgnoredDisk = function() {
        index = $scope.node.ignored_disks.indexOf($scope.ignored);
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
        $http.put(resource + '/' + node.name, node).then(
            function(response) {
                $uibModalInstance.close(true);
            },
            function(reason) {
                alert('Error during update, reason:' + reason);
            }
        );
    };
    var createNode = function(node) {
        $http.post(resource, node).then(
            function(resposne) {
                $uibModalInstance.close(true);
            },
            function(reason) {
                alert('Error during creation, reason:' + reason);
            }
        )
    };

    init_modal();
}]);
