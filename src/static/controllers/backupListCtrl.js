AppModule.controller("BackupListCtrl", ['$scope', '$http', 'MasterModel', 'SizeParser', '$filter', "$uibModal", "$log",
          function($scope, $http, MasterModel, SizeParser, $filter, $uibModal, $log){
    resource = '/api/backup';

    var init = function() {
        $scope.model = MasterModel;
        $scope.parseSize = SizeParser.parse;
        $scope.showDeleted = false;
    };

    $scope.callServer = function(tableState) {
        $scope.loading = true;
        if($scope.tableState === undefined) { // Save table state
            $scope.tableState = tableState;
        } else if (tableState === undefined) { // restore previous state when called manually
            tableState = $scope.tableState;
        }
        $scope.pagination = tableState.pagination;
        var start = $scope.pagination.start || 0;
        var number = $scope.pagination.number || 10;

        $http.get(resource + buildQuerystring(number, start)).then(
            function(response) {
                payload = response.data;
                $scope.backups = payload.data;
                $scope.pagination.numberOfPages = Math.ceil(payload.total / number);
                $scope.pagination.totalItemCount = payload.total;
                $scope.loading = false;
            },
            function(reason) {
                $scope.loading = false;
            }
        )
    };

    var buildQuerystring = function(number, start) {
        querystring = '?limit=' + number + '&offset=' + start + '&deleted=' + $scope.showDeleted
        if($scope.idSearch) {
            querystring += '&id=' + $scope.idSearch;
        }
        if($scope.nodeSearch) {
            querystring += '&node=' + $scope.nodeSearch;
        }
        return querystring
    }

    $scope.mount = function(backup) {
        $scope.model.mounts.mount(backup)
    };
    $scope.unmount = function(backup) {
        $scope.model.mounts.unmount(backup.node, backup.id)
    };
    $scope.delete = function(backup) {
        $http.delete(resource + '/' + backup.id).then(
            function(response) {
                $scope.callServer();
            },
            function(reason) {
                alert("Could not remove backup, reason: " + reason.data)
            }
        )
    };
    $scope.restore = function(backup) {
        var uibModalInstance = $uibModal.open({
            templateUrl: '/static/modals/restoreBackup.html',
            controller: 'RestoreBackupModalCtrl',
            backdrop: 'static',
            resolve: {
                backup: function() {
                    return angular.copy(backup);
                }
            }
        });
        uibModalInstance.result.then(
            function(result) {
                MasterModel.jobs.post(result)
                $log.info(result)
            },
            function() { }
        );
    }
    init();
}])
