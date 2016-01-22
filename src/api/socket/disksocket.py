import requests

import constants
from api.nodeconfig import NodeConfig
from .socketprovider import SocketProvider
from .socketresource import SocketResource

socket = SocketProvider.get_socket()


class DiskSocket(SocketResource):

    def _broadcast_disks(self):
        socket.emit('get:disk', self.data, broadcast=True)

    def _update_data(self):
        data = self._get_data()
        if self.data != data:
            self.data = data
            self._broadcast_disks()

    def _get_data(self):
        disks = {}
        for node in NodeConfig.nodes:
            if NodeConfig.is_enabled_node(node):
                disks[node['name']] = self._get_disk_list(node)
        return disks

    def _get_disk_list(self, node):
        try:
            r = requests.get(NodeConfig.get_node_url(node) + constants.DISK_RESOURCE, timeout=constants.GET_TIMEOUT)
            disk_list = []
            for disk in r.json():
                if not NodeConfig.is_ignored_disk(node, disk['name']):
                    disk_list.append(disk)
            return disk_list
        except Exception as e:
            self._logger.warning("Exception while retrieving disk information. Cause: " + str(e))
            return []


disk = DiskSocket(constants.DISK_REFRESH_INTERVAL)
disk.start()


@socket.on('get:disk')
def get_disk(payload):
    socket.emit('get:disk', disk.data)
    disk.update()
    return "OK"