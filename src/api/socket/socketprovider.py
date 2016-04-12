"""
Author:     Oktawiusz Wilk
Date:       10/04/2016
License:    GPL
"""

from abc import ABCMeta

class SocketProvider:
    """
    A very simple class that allows passing the initialised SocketIO variable without causing
    issues with the circular imports in python. With the use of this class it is possible to
    divide responsibilities and classes using the socket communication into a separate files,
    and load them after in the server.py.
    """

    __metaclass__ = ABCMeta

    socket = None

    @classmethod
    def set_socket(cls, socket):
        """
        Sets the initialised socket to the static variable. This method should be called only once
        at the start of the application.
        :param socket: initialised socket object.
        :return: None
        """
        cls.socket = socket

    @classmethod
    def get_socket(cls):
        """
        Returns the socket instance stored in the static variable. This method can be used by
        any class that needs to use socket for decorators.
        :return: SocketIO object.
        """
        return cls.socket