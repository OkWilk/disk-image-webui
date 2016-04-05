from lib.mdbconnector import MongoConnector, to_list
from lib.observer import Observer
import constants


class _NodeConfig(Observer):
    def __init__(self):
        self.nodes = []
        self.update()

    def update(self, *args, **kwargs):
        with MongoConnector(constants.DB_CONFIG) as db:
            data = db.nodes.find()
        self.nodes = to_list(data)

    def get_node(self, node_id):
        for node in self.nodes:
            if node['name'] == node_id:
                return node
        raise ValueError("Invalid node specified.")

    def is_ignored_disk(self, node, disk_name):
        return disk_name in node['ignored_disks']

    def is_enabled_node(self, node):
        return node['enabled']

    def get_node_url(self, node):
        return 'http://' + str(node['address']) + ':' + str(node['port'])


NodeConfig = _NodeConfig()
