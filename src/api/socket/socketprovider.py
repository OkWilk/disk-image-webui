class SocketProvider:
    socket = None

    @classmethod
    def set_socket(cls, socket):
        cls.socket = socket

    @classmethod
    def get_socket(cls):
        return cls.socket