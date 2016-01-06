from flask_restful import Resource, abort
import requests
from ..nodeconfig import NodeConfig


class Disk(Resource):
    RESOURCE_ADDRESS = '/api/disk'

    def get(self):
        disks = {}
        for node in NodeConfig.nodes:
            if NodeConfig.is_enabled_node(node):
                disks[node['name']] = self._get_disk_list(node)
        return disks

    def _get_disk_list(self, node):
        try:
            r = requests.get(NodeConfig.get_node_url(node) + self.RESOURCE_ADDRESS)
            disk_list = []
            for disk in r.json():
                if not NodeConfig.is_ignored_disk(node, disk['name']):
                    disk_list.append(disk)
            return disk_list
        except:
            return []
