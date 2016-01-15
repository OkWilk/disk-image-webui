from .socketresource import SocketResource
from api.resources.job import Job
from .socketprovider import SocketProvider
from ..nodeconfig import NodeConfig
import requests
import constants


socket = SocketProvider.get_socket()


class JobSocket(SocketResource):

    def _broadcast_jobs(self):
        socket.emit('get:job', self.data, broadcast=True)

    def _update_data(self):
        data = self._get_data()
        if self.data != data:
            self.data = data
            self._broadcast_jobs()
            return True
        return False

    def _get_data(self):
        jobs = {}
        for node in NodeConfig.nodes:
            if NodeConfig.is_enabled_node(node):
                try:
                    r = requests.get(NodeConfig.get_node_url(node) + constants.JOB_RESOURCE)
                    jobs[node['name']] = r.json()
                except:
                    pass
        return jobs

    def delete(self, node_id, job_id):
        try:
            node_id = NodeConfig.get_node(node_id)
            r = requests.delete(NodeConfig.get_node_url(node_id) + constants.JOB_RESOURCE + '/' + job_id)
            if r.status_code == 200:
                self.update()
            return r.text, r.status_code
        except:
            return "Invalid resource requested."

job = JobSocket(constants.JOB_REFRESH_INTERVAL)
job.start()


@socket.on('get:job')
def get_disk(payload):
    socket.emit('get:job', job.data)
    job.update()
    return "OK"


@socket.on('delete:job')
def del_job(payload):
    if 'node_id' in payload and 'job_id' in payload:
        return job.delete(payload['node_id'], payload['job_id'])


@socket.on('post:job')
def post_job(payload):
    try:
        node = NodeConfig.get_node(payload['node'])
        payload.pop('node')
        r = requests.post(NodeConfig.get_node_url(node) + constants.JOB_RESOURCE, json=payload)
        return r.text, r.status_code
    except:
        return "Invalid resource requested.", 400
