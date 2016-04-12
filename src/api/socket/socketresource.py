"""
Author:     Oktawiusz Wilk
Date:       10/04/2016
License:    GPL
"""

import logging
from abc import ABCMeta, abstractmethod
from threading import Thread, Lock
from time import sleep


class SocketResource:
    """
    This class defines the basic structure for other implementations of SocketIO communication
    channels.
    """
    __metaclass__ = ABCMeta

    def __init__(self, interval=0):
        self.data = {}
        self.interval = interval
        self._logger = logging.getLogger(__name__)
        self._lock = Lock()
        self._thread = None
        self._background_update_thread = None

    def start(self):
        """
        Starts a thread to query imaging nodes on the interval.
        :return: None
        """
        if not self._thread:
            self._thread = Thread(target=self._start_interval, daemon=True)
            self._thread.start()

    def stop(self):
        """
        Stops the thread used for querying on the interval.
        :return: None
        """
        previous_interval = self.interval
        self.interval = 0
        self._thread.join()
        self.interval = previous_interval

    def _start_interval(self):
        while self.interval > 0:
            self.update()
            sleep(self.interval)

    @abstractmethod
    def update(self):
        """
        This template method is to be filled with the algorithm for retrieval of
        the data from imaging nodes.
        :return: JSON
        """
        pass

    def background_update(self):
        """
        Starts a background thread to update on request. This update is carried out separately from
        the on interval update, and has no impact on the interval. Only one background thread per
        socket will be running.
        :return: JSON
        """
        if not self._background_update_thread or not self._background_update_thread.is_alive():
            self._background_update_thread = Thread(target=self.update, daemon=True)
            self._background_update_thread.start()