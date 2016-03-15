import logging

from flask import Flask, render_template
from flask_restful import Api
from flask_socketio import SocketIO

from api.nodeconfig import NodeConfig

logging .basicConfig(level=logging.DEBUG, format='%(asctime)s [%(name)s][%(levelname)s]: %(message)s', filename='server.log',
                     filemode='w')

""" Suppress logging from external libraries """
logging.getLogger('werkzeug').setLevel(logging.WARNING)  # Suppress default flask HTTP request logging
logging.getLogger('socketio').setLevel(logging.WARNING)  # Suppress socket io event logging
logging.getLogger('engineio').setLevel(logging.WARNING)  # Suppress socket io request logging
logging.getLogger('requests').setLevel(logging.WARNING)  # Suppress requests logging

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
import api.socket.backupsocket as backupsocket
import api.socket.nodesocket as nodesocket

nodesocket.node.register(NodeConfig)

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


if __name__ == '__main__':
    app.run(port=5080, host='0.0.0.0', threaded=True, debug=True)



