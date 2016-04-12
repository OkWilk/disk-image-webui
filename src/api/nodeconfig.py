"""
Author:     Oktawiusz Wilk
Date:       10/04/2016
License:    GPL
"""

from lib.mdbconnector import MongoConnector, to_list
from lib.observer import Observer
import constants


class _NodeConfig(Observer):
    """
    Node configuration wrapper that takes care of loading data from the database
    and provides the most common function required by other classes.
    """
    def __init__(self):
        self.nodes = []
        self.update()

    def update(self, *args, **kwargs):
        """
        Implements the update method from the Observer interface.
        Retrieves the most recent node configuration from the database.
        :param args: None
        :param kwargs: None
        :return: None
        """
        with MongoConnector(constants.DB_CONFIG) as db:
            data = db.nodes.find()
        self.nodes = to_list(data)

    def get_node(self, node_id):
        """
        Returns a node with the specified ID if it exists, ValueError is raised otherwise
        :param node_id: string identifying imaging node
        :return: dictionary containing node information
        """
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


#Export as singleton.
NodeConfig = _NodeConfig()
