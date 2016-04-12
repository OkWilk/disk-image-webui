"""
Author:     Oktawiusz Wilk
Date:       10/04/2016
License:    GPL
"""

import requests

import constants
from api.nodeconfig import NodeConfig
from .socketprovider import SocketProvider
from .socketresource import SocketResource

socket = SocketProvider.get_socket()


class MetricSocket(SocketResource):
    """
    The socket implementation for collection of metrics from imaging nodes.
    """

    def __init__(self, interval):
        SocketResource.__init__(self, interval)
        self.metrics = {}

    def _broadcast_data(self):
        socket.emit('get:metric', self.metrics, broadcast=True)

    def update(self):
        try:
            data = self._get_data()
            self._remove_missing_nodes(data)
            for node in data.keys():
                if node not in self.metrics:
                    self.metrics[node] = {}
                for metric in data[node].keys():
                    self._update_metric(node, metric, data[node][metric])
            self._broadcast_data()
        except Exception as e:
            self._logger.warning("Failed to update metrics. Cause: : " + str(e))

    def _remove_missing_nodes(self, data):
        for node in self.metrics.keys():
            if node not in data.keys():
                self.metrics.pop(node)

    def _update_metric(self, node, metric, value):
        if metric not in self.metrics[node]:
            self.metrics[node][metric] = [0] * constants.METRIC_LIST_SIZE
        self.metrics[node][metric].pop(0)
        self.metrics[node][metric].append(value)

    def _get_data(self):
        metrics = {}
        for node in NodeConfig.nodes:
            if NodeConfig.is_enabled_node(node):
                try:
                    r = requests.get(NodeConfig.get_node_url(node) + constants.METRIC_RESOURCE,
                                     timeout=constants.GET_TIMEOUT)
                    metrics[node['name']] = r.json()
                except Exception as e:
                    self._logger.warning("Exception while retrieving metric information. Cause: " + str(e))
        return metrics


metric = MetricSocket(constants.METRIC_REFRESH_INTERVAL)
metric.start()


@socket.on('get:metric')
def get_metric(payload):
    socket.emit('get:metric', metric.metrics)
    return {'success': True, 'message': 'OK'}
