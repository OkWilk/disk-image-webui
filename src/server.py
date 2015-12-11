from flask import Flask, request, render_template, jsonify
from flask_restful import Api, Resource, reqparse

import requests

app = Flask(__name__)
api = Api(app)

nodes = {
    'Node1': {
        'enabled': True,
        'address': '127.0.0.1',
        'port': '5000',
        'ignored_disks': ['sda'],
    },
    'Romain': {
        'enabled': False,
        'address': '149.153.104.93',
        'port': '5000',
        'ignored_disks': ['sda'],
    },
}


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/work')
def work():
    return render_template('work.html')


class Disk(Resource):
    RESOURCE_ADDRESS = '/disk'

    def get(self):
        disks = {}
        for node in nodes:
            node_config = nodes[node]
            if node_config['enabled']:
                try:
                    r = requests.get('http://' + node_config['address'] + ':' + node_config['port'] + self.RESOURCE_ADDRESS)
                    disks[node] = r.json()
                    for disk in disks[node].keys():
                        if disk in node_config['ignored_disks']:
                            disks[node].pop(disk)
                except:
                    pass
        return disks


class Backup(Resource):
    RESOURCE_ADDRESS = '/job/backup'

    def get(self):
        jobs = {}
        for node in nodes:
            node_config = nodes[node]
            if node_config['enabled']:
                try:
                    r = requests.get('http://' + node_config['address'] + ':' + node_config['port'] + self.RESOURCE_ADDRESS)
                    jobs[node] = r.json()
                except:
                    pass
        return jobs

    def post(self):
        payload = request.get_json(force=True)
        node = payload.pop('node')
        node_config = nodes[node]
        r = requests.post('http://' + node_config['address'] + ':' + node_config['port'] + self.RESOURCE_ADDRESS, json=payload)
        return r.text, r.status_code


api.add_resource(Disk, '/api/disk')
api.add_resource(Backup, '/job/backup')


if __name__ == '__main__':
    app.run(debug=True, port=5080, host='0.0.0.0', threaded=True)
