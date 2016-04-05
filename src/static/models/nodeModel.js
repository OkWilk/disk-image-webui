AppModule.service("NodeModel", ["$log", "socket", "toaster", function($log, socket, toaster) {
    var NodeModel = {
        data: [],
        status: {
            loading: false
        }
    };

    NodeModel.getNodeById = function(node_id) {
        var selectedNode = null;
        angular.forEach(NodeModel.data, function(node, key) {
            if(node.name == node_id) {
              selectedNode =  node;
            }
        });
        return selectedNode;
    };

    NodeModel.get = function() {
        this.status.loading = true;
        socket.emit('get:node', {}, function(data){
            data = angular.fromJson(data);
            NodeModel.data = data;
            NodeModel.status.loading = false;
        });
    };

    NodeModel.add = function(node, callback) {
        this.status.loading = true;
        socket.emit('add:node', node, function(result){
            if(result.success) {
                callback();
            } else {
                toaster.pop('warning', '', result.message)
            }
        })
    };

    NodeModel.update = function(node) {
        this.status.loading = true;
        socket.emit('update:node', node, function(){})
    };

    NodeModel.delete = function(nodeName) {
        this.status.loading = true;
        var payload = {
            name: nodeName
        };
        socket.emit('delete:node', payload, function(){});
    };

    socket.on('get:node', function(data) {
        data = angular.fromJson(data);
        NodeModel.data = data;
        NodeModel.status.loading = false;
    });

    return NodeModel;
}]);