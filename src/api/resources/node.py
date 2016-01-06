from lib.mdbconnector import MongoConnector, to_list
from flask_restful import Resource, abort
from flask import jsonify, request
from lib.observer import Observable
from api.nodeconfig import NodeConfig
import constants
import requests


# TODO: fix status codes
# TODO: add to update node config
class Node(Resource, Observable):
    def __init__(self):
        Observable.__init__(self)
        self.register(NodeConfig)

    def get(self, node_id=None):
        if node_id:
            return self._get_node_details(node_id)
        else:
            limit = int(request.args.get('limit', 30))
            offset = int(request.args.get('offset', 0))
            return self._get_node_list(limit, offset)

    def post(self):
        data = request.get_json()
        if not data:
            return "Node data was not received by the server.", 400
        else:
            return self._insert_node(data)

    def put(self, node_id):
        data = request.get_json()
        if node_id == data['name']:
            return self._update_node(data)
        else:
            return 'Node name missmatch detected.', 400

    def delete(self, node_id):
        with MongoConnector(constants.DB_CONFIG) as db:
            result = db.nodes.remove({'name': node_id})
        if result['n']:
            self.update_observers()
            return 'OK', 200
        else:
            return 'Requested node does not exist.', 404

    def _get_node_details(self, node_id):
        with MongoConnector(constants.DB_CONFIG) as db:
            data = db.nodes.find_one({'name': node_id}, {'_id':0})
        if data:
            return data
        else:
            abort(404, message='Cannot retrieve node information for ' + str(node_id) + '.')

    def _get_node_list(self, limit, offset):
        with MongoConnector(constants.DB_CONFIG) as db:
            nodes_data = db.nodes.find({}, {'_id':0}).skip(offset).limit(limit)
        return to_list(nodes_data)

    def _insert_node(self, data):
        with MongoConnector(constants.DB_CONFIG) as db:
            if db.nodes.find_one({'name': data['name']}):
                return 'The node with name "' + data['name'] + '" already exists.', 400
            else:
                db.nodes.insert(data)
                self.update_observers()
                return 'OK', 200

    def _update_node(self, data):
        with MongoConnector(constants.DB_CONFIG) as db:
            result = db.nodes.update({'name': data['name']}, {'$set': data})
        if result['n']:
            self.update_observers()
            return 'OK', 200
        else:
            self.update_observers()
            return self._insert_node(data)
