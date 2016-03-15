from flask.json import dumps

import constants
from lib.mdbconnector import MongoConnector, to_list
from lib.observer import Observable
from .socketprovider import SocketProvider
from .socketresource import SocketResource
socket = SocketProvider.get_socket()


class NodeSocket(SocketResource, Observable):
    def __init__(self):
        Observable.__init__(self)
        super(NodeSocket,self).__init__()

    def update(self):
        self.update_observers()
        socket.emit('get:node', self.get(), broadcast=True)

    def get(self):
        with MongoConnector(constants.DB_CONFIG) as db:
            return dumps(to_list(db.nodes.find({}, {'_id': 0})))

    def add(self, node):
        with MongoConnector(constants.DB_CONFIG) as db:
            if db.nodes.find_one({'name': node['name']}):
                return {'success': False, 'message': 'The node with name "' + node['name'] + '" already exists.'}
            else:
                db.nodes.insert(node)
                self.update()
                return {'success': True, 'message': 'OK'}

    def upsert(self, node):
        with MongoConnector(constants.DB_CONFIG) as db:
            result = db.nodes.update({'name': node['name']}, {'$set': node})
        if result['n']:
            self.update()
            return {'success': True, 'message': 'OK'}
        else:
            return self.add(node)

    def delete(self, node_id):
        with MongoConnector(constants.DB_CONFIG) as db:
            result = db.nodes.remove({'name': node_id})
        if result['n']:
            self.update()
            return {'success': True, 'message': 'OK'}
        else:
            return 'Requested node does not exist.', 404


node = NodeSocket()


@socket.on('get:node')
def get_node(payload):
    return node.get()


@socket.on('add:node')
def add_node(payload):
    if not payload:
        return 'Empty payload detected, a node object is required for this operation.'
    return node.add(payload)


@socket.on('update:node')
def update_node(payload):
    if not payload:
        return 'Empty payload detected, a node object is required for this operation.'
    return node.upsert(payload)


@socket.on('delete:node')
def delete_node(payload):
    if 'name' not in payload:
        return 'Invalid payload, the required fields are: name.'
    return node.delete(payload['name'])
