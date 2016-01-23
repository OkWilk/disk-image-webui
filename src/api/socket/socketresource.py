import logging
from threading import Thread, Lock
from time import sleep


class SocketResource:

    def __init__(self, interval):
        self.data = {}
        self.interval = interval
        self._logger = logging.getLogger(__name__)
        self._lock = Lock()
        self._thread = None

    def start(self):
        if not self._thread:
            self._thread = Thread(target=self._start_interval,daemon=True)
            self._thread.start()

    def stop(self):
        previous_interval = self.interval
        self.interval = 0
        self._thread.join()
        self.interval = previous_interval

    def _start_interval(self):
        while self.interval > 0:
            self.update()
            sleep(self.interval)

    def update(self):
        self._update_data()

    def _update_data(self):
        pass
