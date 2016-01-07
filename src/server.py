from flask import Flask, request, render_template, jsonify
from flask_restful import Api, Resource, reqparse
from api.resources.disk import Disk
from api.resources.job import Job
from api.resources.node import Node
import requests

app = Flask(__name__)
api = Api(app)


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


if __name__ == '__main__':
    app.run(debug=True, port=5080, host='0.0.0.0', threaded=True)
