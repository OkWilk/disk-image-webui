from abc import ABCMeta, abstractmethod


class Observable:
    def __init__(self):
        self.observers = []

    def register(self, observer):
        if observer not in self.observers:
            self.observers.append(observer)

    def unregistrer(self, observer):
        if observer in self.observers:
            self.observers.remove(observer)

    def unregister_all(self):
        self.observers = []

    def update_observers(self, *args, **kwargs):
        for observer in self.observers:
            observer.update(*args, **kwargs)


class Observer:
    __metaclas__ = ABCMeta

    @abstractmethod
    def update(self, *args, **kwargs):
        pass
