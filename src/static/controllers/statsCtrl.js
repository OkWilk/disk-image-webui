/*
Author:     Oktawiusz Wilk
Date:       10/04/2016
License:    GPL
*/

AppModule.controller('StatsCtrl', ['$scope', '$interval', 'MasterModel', function($scope, $interval, MasterModel) {

    var init = function() {
        initCharts();
        MasterModel.metrics.addObserverCallback(updateData);
    };

    var initCharts = function() {
        $scope.model = MasterModel;
        $scope.labels = [];
        $scope.series = [];
        $scope.options = {
            pointDot: false,
            datasetFill: false,
            animation: false,
            showTooltips: false,
            scaleShowVerticalLines: false,
            scaleOverride: true,
            scaleSteps: 5,
            scaleStepWidth: 20,
            scaleStartValue: 0
        };
    };

    var updateData = function() {
        $scope.series = Object.keys($scope.model.metrics.data);
        cpuUtil = [];
        ramUtil = [];
        diskUtil = [];
        diskIOUtil = [];
        angular.forEach($scope.series, function(key, index) {
            cpuUtil[index] = $scope.model.metrics.data[key]['CPU_Utilisation'];
            ramUtil[index] = $scope.model.metrics.data[key]['RAM_Utilisation'];
            diskUtil[index] = $scope.model.metrics.data[key]['DiskSpace'];
            diskIOUtil[index] = $scope.model.metrics.data[key]['Disk_IO_Utilisation'];
        });
        adjustLabels(cpuUtil[0]);
        $scope.cpuUtil = cpuUtil;
        $scope.ramUtil = ramUtil;
        $scope.diskUtil = diskUtil;
        $scope.diskIOUtil = diskIOUtil
    };

    var adjustLabels = function(data) {
        var difference = data.length - $scope.labels.length;
        if(difference > 0) {
            for(i=0; i < difference; ++i) {
                $scope.labels.push("");
            }
        } else if(difference < 0) {
            for(i=difference; i < 0; ++i) {
                $scope.labels.pop();
            }
        }
    };
    init();
}]);
