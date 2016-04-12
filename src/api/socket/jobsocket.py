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


class JobSocket(SocketResource):
    """
    The socket implementation for retrieving, starting and cancelling of jobs.
    """

    def _broadcast_jobs(self):
        socket.emit('get:job', self.data, broadcast=True)

    def update(self):
        data = self._get_data()
        if self.data != data:
            with self._lock:
                self.data = data
            self._broadcast_jobs()

    def _get_data(self):
        jobs = {}
        for node in NodeConfig.nodes:
            if NodeConfig.is_enabled_node(node):
                try:
                    r = requests.get(NodeConfig.get_node_url(node) + constants.JOB_RESOURCE,
                                     timeout=constants.GET_TIMEOUT)
                    jobs[node['name']] = r.json()
                except Exception as e:
                    self._logger.warning('Exception while retrieving job data. Cause: ' + str(e))
        return jobs

    def delete(self, node_id, job_id):
        try:
            node_id = NodeConfig.get_node(node_id)
            r = requests.delete(NodeConfig.get_node_url(node_id) + constants.JOB_RESOURCE + '/' + job_id,
                                timeout=constants.LONG_TIMEOUT)
            if r.status_code == 200:
                return {'success': True, 'message': 'OK'}
            else:
                return {'success': False, 'message': str(r.text).strip().strip('"')}
        except Exception as e:
            self._logger.warning("Exception while removing job. Cause: " + str(e))
            return {'success': False, 'message': str(e)}

    def create(self, node_id, payload):
        try:
            r = requests.post(NodeConfig.get_node_url(node_id) + constants.JOB_RESOURCE, json=payload,
                              timeout=constants.LONG_TIMEOUT)
            r.raise_for_status()
            return {'success': True, 'message': str(r.text).strip().strip('"')}
        except Exception as e:
            self._logger.warning("Exception while adding a new job. Cause: " + str(e))
            return {'success': False, 'message': str(r.text).strip().strip('"')}


job = JobSocket(constants.JOB_REFRESH_INTERVAL)
job.start()


@socket.on('get:job')
def get_disk(payload):
    socket.emit('get:job', job.data)
    job.background_update()
    return {'success': False, 'message': 'OK'}


@socket.on('delete:job')
def delete_job(payload):
    if 'node' in payload and 'job_id' in payload:
        result = job.delete(payload['node'], payload['job_id'])
        if result['success']:
            job.background_update()
        return result


@socket.on('post:job')
def post_job(payload):
    try:
        node = NodeConfig.get_node(payload['node'])
        payload.pop('node')
        result = job.create(node, payload)
        if result['success']:
            job.background_update()
        return result
    except KeyError as e:
        return {'success': False, 'message': "Invalid payload format, the required 'node' "
                                             "parameter was not provided."}