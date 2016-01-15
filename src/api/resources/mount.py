from flask import request
from flask_restful import Resource
from ..nodeconfig import NodeConfig
import requests


class Mount(Resource):
    RESOURCE_ADDRESS = '/api/mount'

    def get(self):
        mounts = {}
        for node in NodeConfig.nodes:
            if NodeConfig.is_enabled_node(node):
                try:
                    r = requests.get(NodeConfig.get_node_url(node) + self.RESOURCE_ADDRESS)
                    mounts[node['name']] = r.json()
                except:
                    pass
        return mounts

    def post(self, node_id):
        try:
            node = NodeConfig.get_node(node_id)
            payload = request.get_json(force=True)
            r = requests.post(NodeConfig.get_node_url(node) + self.RESOURCE_ADDRESS, json=payload)
            return r.text, r.status_code
        except:
            return 'Invalid resource requested.', 404

    def delete(self, node_id, backup_id):
        try:
            node = NodeConfig.get_node(node_id)
            r = requests.delete(NodeConfig.get_node_url(node) + self.RESOURCE_ADDRESS + '/' + backup_id)
            return r.text, r.status_code
        except:
            return 'Invalid resource requested.', 404
