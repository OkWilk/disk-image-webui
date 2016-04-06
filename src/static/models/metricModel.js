AppModule.service("MetricModel", ["socket", function(socket) {
    var MetricModel = {
        observerCallbacks: [],
        data: null,
        status: {
            loading: false
        }
    };

    MetricModel.get = function() {
        this.status.loading = true;
        socket.emit('get:metric', {}, function(){});
    };

    MetricModel.addObserverCallback = function(callback) {
        MetricModel.observerCallbacks.push(callback)
    };

    MetricModel.removeObserverCallback = function(callback) {
        MetricModel.observerCallbacks.remove(callback)
    };

    var notifyObservers = function(){
        angular.forEach(MetricModel.observerCallbacks, function(callback){
            callback();
        });
    };

    socket.on('get:metric', function(data) {
        MetricModel.data = data;
        notifyObservers();
        MetricModel.status.loading = false;
    });

    return MetricModel;
}]);