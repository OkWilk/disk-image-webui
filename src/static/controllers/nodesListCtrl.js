AppModule.controller("NodesListCtrl", ['$scope', '$http', '$uibModal', function($scope, $http, $uibModal){
    resource = '/api/node';

    $scope.refresh = function() {
        $http.get(resource).then(
            function(response) {
                $scope.nodes = response.data;
            },
            function(reason) {
                console.log(reason)
            }
        )
    };
    $scope.delete = function(node) {
        $http.delete(resource + '/' + node.name).then(
            function(response) {
                $scope.refresh();
            },
            function(reason) {
                alert("Could not remove node, reason: " + reason)
            }
        )
    };
    $scope.edit = function(node) {
        var uibModalInstance = $uibModal.open({
            templateUrl: '/static/modals/nodeEdit.html',
            controller: 'NodeModalCtrl',
            backdrop: 'static',
            resolve: {
                node: function() {
                    return angular.copy(node);
                }
            }
        });
        uibModalInstance.result.then(
            function(result) {
                $scope.refresh();
            },
            function() { }
        );
    };
    $scope.addNode = function() {
        var uibModalInstance = $uibModal.open({
            templateUrl: '/static/modals/nodeEdit.html',
            controller: 'NodeModalCtrl',
            resolve: {
                node: function() {
                    return null;
                }
            }
        });
        uibModalInstance.result.then(
            function(result) {
                $scope.refresh();
            },
            function() { }
        );
    };
    $scope.refresh();
}])
