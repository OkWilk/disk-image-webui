from datetime import datetime

from pymongo import DESCENDING

import constants
from lib.mdbconnector import MongoConnector, to_list
from .socketprovider import SocketProvider
from .socketresource import SocketResource
from flask.json import dumps
socket = SocketProvider.get_socket()


class BackupSocket(SocketResource):
    def get(self, id=None, node=None, deleted=False, limit=10, offset=0):
        if id:
            return dumps(self._get_backup_details(id, limit, offset))
        else:
            return dumps(self._get_backup_list(node, deleted, limit, offset))

    def _get_backup_list(self, node_id=None, show_deleted=False, limit=10, offset=0):
        with MongoConnector(constants.DB_CONFIG) as db:
            query = {}
            if not show_deleted:
                query['deleted'] = False
            if node_id:
                query['node'] = node_id
            data = db.backup.find(query, {'_id': 0}).sort('creation_date', DESCENDING).skip(offset).limit(limit)
            payload = {
                'data': to_list(data),
                'offset': offset,
                'limit': limit,
                'total': data.count()
            }
        return payload

    def _get_backup_details(self, backup_id, limit, offset):
        with MongoConnector(constants.DB_CONFIG) as db:
            data = db.backup.find({'id': {'$regex': str(backup_id)}}, {'_id': 0}).sort('creation_date', DESCENDING) \
                .skip(offset).limit(limit)
        if data:
            payload = {
                'data': to_list(data),
                'offset': offset,
                'limit': limit,
                'total': data.count(),
            }
            return payload
        else:
            return "Requested resource is not available.", 404

    def delete(self, backup_id):
        with MongoConnector(constants.DB_CONFIG) as db:
            result = db.backup.update({'id': backup_id},
                                      {'$set': {'deleted': True},
                                       '$currentDate': {'deletion_date': True}})
        if result['n']:
            return 'OK', 200
        else:
            return 'Requested backup does not exist.', 404

    def undelete(self, backup_id):
        with MongoConnector(constants.DB_CONFIG) as db:
            result = db.backup.update({'id': backup_id},
                                      {'$set': {'deleted': False, 'deletion_date': ''}})
        if result['n']:
            return 'OK', 200
        else:
            return 'Requested backup does not exist.', 404

    def _current_date(self):
        return datetime.today().strftime(constants.DATE_FORMAT)


backup = BackupSocket()


@socket.on('get:backup')
def get_backup(payload):
    if 'deleted' not in payload or 'limit' not in payload or 'offset' not in payload:
        return 'Invalid payload, the required fields are: deleted, limit and offset.'
    backup_id = None
    node = None
    if 'id' in payload:
        backup_id = payload['id']
    if 'node' in payload:
        node = payload['node']
    return backup.get(backup_id, node, payload['deleted'], payload['limit'], payload['offset'])


@socket.on('delete:backup')
def delete_backup(payload):
    if 'id' not in payload:
        return 'Invalid payload, the required fields are: id.'
    return backup.delete(payload['id'])

@socket.on('undelete:backup')
def undelete_backup(payload):
    if 'id' not in payload:
        return 'Invalid payload, the required fields are: id.'
    return backup.undelete(payload['id'])