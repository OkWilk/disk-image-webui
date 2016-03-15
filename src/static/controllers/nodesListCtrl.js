AppModule.controller("NodesListCtrl", ['$scope', '$http', '$uibModal', 'MasterModel',
    function($scope, $http, $uibModal, MasterModel){

    var init = function() {
        $scope.model = MasterModel;
        $scope.refresh();
    };
    $scope.refresh = function() {
        $scope.model.nodes.get()
    };
    $scope.delete = function(node) {
        $scope.model.nodes.delete(node.name)
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
            function() {
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
            function() {
                $scope.refresh();
            }
        );
    };

    init();
}]);
