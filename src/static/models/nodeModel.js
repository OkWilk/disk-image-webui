/*
Author:     Oktawiusz Wilk
Date:       10/04/2016
License:    GPL
Purpose:    This file provides encapsulation of the communication between Python server
            and frontend using the Socket.IO channels. It is responsible for interacting
            with the NodeSocket, and provides data required by most of the controllers.
*/
AppModule.service("NodeModel", ["socket", "toaster", function(socket, toaster) {
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
            if(!result.success) {
                toaster.pop('warning', '', result.message)
            }
            callback(result.success);
        })
    };

    NodeModel.update = function(node, callback) {
        this.status.loading = true;
        socket.emit('update:node', node, function(result){
            if(!result.success) {
                toaster.pop('warning', '', result.message)
            }
            callback(result.success);
        })
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