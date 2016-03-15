import requests

import constants
from .socketprovider import SocketProvider
from .socketresource import SocketResource
from ..nodeconfig import NodeConfig

socket = SocketProvider.get_socket()


class MountSocket(SocketResource):

    def _broadcast_mounts(self):
        socket.emit('get:mount', self.data, broadcast=True)

    def update(self):
        data = self._get_data()
        if self.data != data:
            self.data = data
            self._broadcast_mounts()

    def _get_data(self):
        mounts = {}
        for node in NodeConfig.nodes:
            if NodeConfig.is_enabled_node(node):
                try:
                    r = requests.get(NodeConfig.get_node_url(node) + constants.MOUNT_RESOURCE,
                                     timeout=constants.GET_TIMEOUT)
                    mounts[node['name']] = r.json()
                except Exception as e:
                    self._logger.warn("Exception while retrieving mount information. Cause: " + str(e))
        return mounts

    def mount(self, node_id, payload):
        try:
            node = NodeConfig.get_node(node_id)
            r = requests.post(NodeConfig.get_node_url(node) + constants.MOUNT_RESOURCE, json=payload)
            return r.json()
        except Exception as e:
            self._logger.warn("Exception while mounting backup. Cause: " + str(e))
            return 'Invalid resource requested.', 404

    def unmount(self, node_id, backup_id):
        try:
            node = NodeConfig.get_node(node_id)
            r = requests.delete(NodeConfig.get_node_url(node) + constants.MOUNT_RESOURCE + '/' + backup_id,
                                timeout=constants.LONG_TIMEOUT)
            return r.json()
        except Exception as e:
            self._logger.warn("Exception while unmounting backup. Cause: " + str(e))
            return 'Invalid resource requested.', 404

mount = MountSocket(constants.MOUNT_REFRESH_INTERVAL)
mount.start()


@socket.on('get:mount')
def get_mount(message):
    socket.emit('get:mount', mount.data)
    mount.update()
    return "OK"


@socket.on('delete:mount')
def delete_mount(payload):
    if 'node_id' in payload and 'backup_id' in payload:
        result = mount.unmount(payload['node_id'], payload['backup_id'])
        if 'OK' in result:
            mount.update()
        return result
    return "Missing node_id or backup_id in payload.", 400


@socket.on('post:mount')
def create_mount(payload):
    if 'node_id' in payload and 'backup_id' in payload:
        result = mount.mount(payload['node_id'], payload)
        if 'OK' in result:
            mount.update()
        return result
    return "Missing node_id or backup_id in payload.", 400