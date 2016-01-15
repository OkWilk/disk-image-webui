from flask import request
from flask_restful import Resource, abort
from ..nodeconfig import NodeConfig
import requests


class Job(Resource):
    RESOURCE_ADDRESS = '/api/job'

    def post(self, node_id):
        try:
            node = NodeConfig.get_node(node_id)
            payload = request.get_json(force=True)
            r = requests.post(NodeConfig.get_node_url(node) + self.RESOURCE_ADDRESS, json=payload)
            return r.text, r.status_code
        except:
            abort(404, message="Invalid resource requested.")

