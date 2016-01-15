from server import api
from api.resources.disk import Disk
from api.resources.job import Job
from api.resources.node import Node
from api.resources.backup import Backup
from api.resources.mount import Mount

api.add_resource(Disk, '/api/disk')
api.add_resource(Job, '/api/job', '/api/<node_id>/job', '/api/<node_id>/job/<job_id>')
api.add_resource(Node, '/api/node', '/api/node/<node_id>')
api.add_resource(Backup, '/api/backup', '/api/backup/<backup_id>', '/api/<node_id>/backup', '/api/<node_id>/backup/<backup_id>')
api.add_resource(Mount, '/api/mount', '/api/<node_id>/mount', '/api/<node_id>/mount/<backup_id>')