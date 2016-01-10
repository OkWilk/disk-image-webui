AppModule.controller('StatsCtrl', ['$scope', '$interval', 'socket', function($scope, $interval, socket) {
    $scope.labels = [];
    $scope.series = ['Localhost', 'Raspberry'];
    $scope.options = {
        pointDot: false,
        datasetFill: false,
        animation: false,
        showTooltips: false,
        scaleShowVerticalLines: false
    };
    $scope.update = function() {
        updateData($scope.data1);
        updateData($scope.data2);
        updateData($scope.data3);
        updateData($scope.data4);
    };
    var initCharts = function() {
        for(i = 0; i < 30; ++i){
            $scope.labels.push("");
        }
        $scope.data1 = [
            Array.apply(null, {length: 30}).map(Function.call, getRandomValue),
            Array.apply(null, {length: 30}).map(Function.call, getRandomValue)
        ];
        $scope.data2 = [
            Array.apply(null, {length: 30}).map(Function.call, getRandomValue),
            Array.apply(null, {length: 30}).map(Function.call, getRandomValue)
        ];
        $scope.data3 = [
            Array.apply(null, {length: 30}).map(Function.call, getRandomValue),
            Array.apply(null, {length: 30}).map(Function.call, getRandomValue)
        ];
        $scope.data4 = [
            Array.apply(null, {length: 30}).map(Function.call, getRandomValue),
            Array.apply(null, {length: 30}).map(Function.call, getRandomValue)
        ];
    };
    var updateData = function(data) {
        angular.forEach(data, function(list){
            list.splice(0,1);
            list.push(getRandomValue());
        })
    }
    var getRandomValue = function() {
        return Math.floor(Math.random() * 100);
    }
    var intervalUpdate = function() {
        $interval($scope.update, 3000);
    };
    intervalUpdate();
    initCharts();
}])
