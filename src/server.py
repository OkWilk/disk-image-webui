from flask import Flask, request, render_template, jsonify
from flask_restful import Api, Resource, reqparse
from api.resources.disk import Disk, DiskDetail
from api.resources.job import Job, JobAdd, JobRemove
from api.resources.node import Node
import requests

app = Flask(__name__)
api = Api(app)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/dashboard')
def dashboard():
    return render_template('dashboard.html')


@app.route('/nodes')
def nodes():
    return render_template('nodes.html')


api.add_resource(Disk, '/api/disk')
api.add_resource(DiskDetail, '/api/<node_id>/disk/<disk_id>')
api.add_resource(Job, '/api/job')
api.add_resource(JobRemove, '/api/<node_id>/job/<job_id>')
api.add_resource(JobAdd, '/api/<node_id>/job')
api.add_resource(Node, '/api/node', '/api/node/<node_id>')


if __name__ == '__main__':
    app.run(debug=True, port=5080, host='0.0.0.0', threaded=True)
