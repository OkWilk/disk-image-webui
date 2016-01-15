AppModule.controller("BackupListCtrl", ['$scope', '$http', 'SizeParser', function($scope, $http, SizeParser){
    resource = '/api/backup';

    var init = function() {
        $scope.parseSize = SizeParser.parse;
        $scope.refresh();
    }
    $scope.refresh = function() {
        $http.get(resource).then(
            function(response) {
                $scope.backups = response.data;
            },
            function(reason) {
                console.log(reason.data)
            }
        )
    };
    $scope.mount = function(backup) {
        payload = {
            backup_id: backup.id
        }
        $http.post('/api/' + backup.node +'/mount', payload).then(
            function(response) {
                $scope.refresh();
            },
            function(reason) {
                alert(reason.data)
            }
        )
    };
    $scope.unmount = function(backup) {
        $http.delete('/api/' + backup.node + '/mount/' + backup.id).then(
            function(response) {
                $scope.refresh();
            },
            function(reason) {
                alert(reason.data);
            }
        )
    };
    $scope.delete = function(backup) {
        $http.delete(resource + '/' + backup.id).then(
            function(response) {
                $scope.refresh();
            },
            function(reason) {
                alert("Could not remove backup, reason: " + reason.data)
            }
        )
    };
    init();
}])
