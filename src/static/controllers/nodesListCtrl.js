/*
Author:     Oktawiusz Wilk
Date:       10/04/2016
License:    GPL
*/

AppModule.controller("NodesListCtrl", ['$scope', '$uibModal', 'MasterModel', '$confirm',
    function($scope, $uibModal, MasterModel, $confirm){

    var init = function() {
        $scope.model = MasterModel;
    };
    $scope.update = function() {
        $scope.model.nodes.get()
    };
    $scope.delete = function(node) {
        $confirm({title: "Delete Node", text:"Are you sure you want to delete the node '" + node.name + "'?"}).then(
            function() {
                $scope.model.nodes.delete(node.name);
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
            function() {
                $scope.update();
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
                $scope.update();
            }
        );
    };

    init();
}]);
