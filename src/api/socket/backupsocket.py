# import constants
# from api.resources.disk import Disk
# from .socketprovider import SocketProvider
# from .socketresource import SocketResource
#
# socket = SocketProvider.get_socket()
#
# class DiskSocket(SocketResource):
#
#     def _broadcast_disks(self):
#         socket.emit('get:disk', self.data, broadcast=True)
#
#     def _update_data(self):
#         data = Disk().get()
#         self._lock.acquire()
#         if self.data != data:
#             self.data = data
#             self._broadcast_disks()
#         self._lock.release()
#
# disk = DiskSocket(constants.DISK_REFRESH_INTERVAL)
# disk.start()
#
# @socket.on('get:backup')
# def get_disk(payload):
#     socket.emit('get:backup', disk.data)
#     disk.update()
#     return "OK"