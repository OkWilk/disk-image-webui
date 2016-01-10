AppModule.service('DiskListModel', ['$http', function($http) {
    var disks = {};
    var status = {
        loading: false
    };
    var DiskListModel = {};
    var getDiskInfo = function() {
        status.loading = true;
        $http.get('/api/disk').
        success(function(data, status, headers, config) {
            disks = data;
            status.loading = false;
        })
    }
    DiskListModel.getDisks = function() {
        return disks;
    }
    DiskListModel.getStatus = function() {
        return status;
    }
    DiskListModel.update = function() {
        getDiskInfo();
    }
    DiskListModel.update();

    return DiskListModel;
}]);
