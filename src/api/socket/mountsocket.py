"""
Author:     Oktawiusz Wilk
Date:       10/04/2016
License:    GPL
"""

import requests

import constants
from .socketprovider import SocketProvider
from .socketresource import SocketResource
from ..nodeconfig import NodeConfig

socket = SocketProvider.get_socket()


class MountSocket(SocketResource):
    """
    The socket implementation for management of the mounted jobs on imaging nodes.
    """

    def _broadcast_mounts(self):
        socket.emit('get:mount', self.data, broadcast=True)

    def update(self):
        data = self._get_data()
        if self.data != data:
            with self._lock:
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
            r = requests.post(NodeConfig.get_node_url(node) + constants.MOUNT_RESOURCE, json=payload,
                              timeout=constants.POST_TIMEOUT)
            if r.status_code == 200:
                return {'success': True, 'message': 'OK'}
            else:
                return {'success': False, 'message': str(r.text).strip().strip('"')}
        except Exception as e:
            self._logger.warn("Exception while mounting backup. Cause: " + str(e))
            return {'success': False, 'message': 'Could not mount resource at this time.'}

    def unmount(self, node_id, backup_id):
        try:
            node = NodeConfig.get_node(node_id)
            r = requests.delete(NodeConfig.get_node_url(node) + constants.MOUNT_RESOURCE + '/' + backup_id,
                                timeout=constants.POST_TIMEOUT)
            if r.status_code == 200:
                return {'success': True, 'message': 'OK'}
            else:
                return {'success': False, 'message': str(r.text).strip().strip('"')}
        except Exception as e:
            self._logger.warn("Exception while unmounting backup. Cause: " + str(e))
            return {'success': False, 'message': 'Invalid resource requested.'}

mount = MountSocket(constants.MOUNT_REFRESH_INTERVAL)
mount.start()


@socket.on('get:mount')
def get_mount(message):
    socket.emit('get:mount', mount.data)
    mount.background_update()
    return {'success': True, 'message': 'OK'}


@socket.on('delete:mount')
def delete_mount(payload):
    if 'node_id' in payload and 'backup_id' in payload:
        result = mount.unmount(payload['node_id'], payload['backup_id'])
        if result['success']:
            mount.background_update()
        return result
    return {'success': True, 'message': "Missing node_id or backup_id in payload."}


@socket.on('post:mount')
def create_mount(payload):
    if 'node_id' in payload and 'backup_id' in payload:
        result = mount.mount(payload['node_id'], payload)
        if result['success']:
            mount.background_update()
        return result
    return {'success': True, 'message': "Missing node_id or backup_id in payload."}
