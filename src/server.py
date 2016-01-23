from flask import Flask, render_template
from flask_restful import Api
from flask_socketio import SocketIO

from api.resources.backup import Backup
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
import api.socket.metricsocket as metricsocket


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


api.add_resource(Node, '/api/node', '/api/node/<node_id>')
api.add_resource(Backup, '/api/backup', '/api/backup/<backup_id>', '/api/<node_id>/backup', '/api/<node_id>/backup/<backup_id>')


if __name__ == '__main__':
    app.run(port=5080, host='0.0.0.0', threaded=True)



