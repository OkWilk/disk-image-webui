from flask import Flask, render_template
from flask_restful import Api
from flask_socketio import SocketIO

from api.resources.backup import Backup
from api.resources.disk import Disk
from api.resources.job import Job
from api.resources.mount import Mount
from api.resources.node import Node

app = Flask(__name__)
api = Api(app)
socket = SocketIO(app)

# All socket_io based modules should be imported after setting up the socket provider.
from api.socket.socketprovider import SocketProvider
SocketProvider.set_socket(socket)
import api.socket.disksocket as disksocket
import api.socket.jobsocket as jobsocket
import api.socket.mountsocket as mountsocket

@app.route('/')
def index():
    return render_template('dashboard.html')


@app.route('/backups')
def backups():
    return render_template('backups.html')


@app.route('/nodes')
def nodes():
    return render_template('nodes.html')


@app.route('/config')
def config():
    return render_template('config.html')


api.add_resource(Disk, '/api/disk')
api.add_resource(Job, '/api/job', '/api/<node_id>/job', '/api/<node_id>/job/<job_id>')
api.add_resource(Node, '/api/node', '/api/node/<node_id>')
api.add_resource(Backup, '/api/backup', '/api/backup/<backup_id>', '/api/<node_id>/backup', '/api/<node_id>/backup/<backup_id>')
api.add_resource(Mount, '/api/mount', '/api/<node_id>/mount', '/api/<node_id>/mount/<backup_id>')


if __name__ == '__main__':
    app.run(port=5080, host='0.0.0.0', threaded=True)



