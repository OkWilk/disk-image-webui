AppModule.controller("BackupListCtrl", ['$scope', '$http', 'MasterModel', 'BackupModel', 'SizeParser', '$filter',
    '$uibModal', '$log', '$confirm',
    function($scope, $http, MasterModel, BackupModel, SizeParser, $filter, $uibModal, $log, $confirm){

    var init = function() {
        $scope.model = MasterModel;
        $scope.parseSize = SizeParser.parse;
        $scope.showDeleted = false;
    };
    $scope.callServer = function(tableState) {
        $scope.loading = true;
        if($scope.tableState === undefined) { // Save table state
            $scope.tableState = tableState;
        } else if (tableState === undefined || tableState === null) { // restore previous state when called manually
            tableState = $scope.tableState;
        }
        $scope.pagination = tableState.pagination;
        var start = $scope.pagination.start || 0;
        var number = $scope.pagination.number || 10;
        BackupModel.get($scope.idSearch, $scope.nodeSearch, $scope.showDeleted, number, start, refresh);
    };
    var refresh = function() {
        $scope.backups = BackupModel.backups;
        $scope.pagination.numberOfPages = BackupModel.numberOfPages;
        $scope.pagination.totalItemCount = BackupModel.totalItemCount;
        $scope.loading = BackupModel.status.loading;
    };
    $scope.mount = function(backup) {
        $scope.model.mounts.mount(backup)
    };
    $scope.unmount = function(backup) {
        $scope.model.mounts.unmount(backup.node, backup.id)
    };
    $scope.delete = function(backup) {
        $confirm({title: "Delete backup", text:"Are you sure you want to delete backup '" + backup.id + "'?"}).then(
            function() {
                BackupModel.delete(backup.id, function() {
                    $scope.callServer();
                });
            }
        )
    };
    $scope.undelete = function(backup) {
        $confirm({title: "Undelete backup", text:"Are you sure you want to undelete backup '" + backup.id + "'?"}).then(
            function() {
                BackupModel.undelete(backup.id, function(){
                    $scope.callServer();
                });
            }
        )
    }
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
