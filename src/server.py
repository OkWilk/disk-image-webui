from flask import Flask, request, render_template, jsonify
from flask_restful import Api, Resource, reqparse
from flask_socketio import SocketIO, send, emit
from api.resources.disk import Disk
from api.resources.job import Job
from api.resources.node import Node
from api.resources.backup import Backup
import requests

app = Flask(__name__)
api = Api(app)
socket = SocketIO(app)


@socket.on('ping')
def ping(message):
    print(str(message))
    return "OK"


def emit_message():
    print('broadcasting bla!')
    socket.emit('test', {'message': 'bla'}, broadcast=True)


@app.route('/')
def index():
    return render_template('dashboard.html')


@app.route('/backups')
def backups():
    emit_message()
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

if __name__ == '__main__':
    app.run(debug=True, port=5080, host='0.0.0.0', threaded=True)
