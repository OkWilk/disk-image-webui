from datetime import datetime

from flask import request
from flask_restful import Resource
from pymongo import DESCENDING

import constants
from lib.mdbconnector import MongoConnector, to_list


class Backup(Resource):
    DEFAULT_LIMIT = 20
    DEFAULT_OFFSET = 0

    def get(self, backup_id=None, node_id=None):
        limit = int(request.args.get('limit', self.DEFAULT_LIMIT))
        offset = int(request.args.get('offset', self.DEFAULT_OFFSET))
        deleted = bool(request.args.get('deleted', False) == 'true')
        id = request.args.get('id', '')
        node = request.args.get('node', '')
        if id:
            return self._get_backup_details(id, limit, offset)
        else:
            return self._get_backup_list(node, deleted, limit, offset)

    def _get_backup_list(self, node_id=None, show_deleted=False, limit=DEFAULT_LIMIT, offset=DEFAULT_OFFSET):
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
            data = db.backup.find({'id': {'$regex': str(backup_id)}}, {'_id':0}).sort('creation_date', DESCENDING)\
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

    def post(self):
        data = request.get_json()
        if not data:
            return "Backup data was not received by the server.", 400
        else:
            return self._insert_backup(data)

    def _insert_backup(self, data):
        with MongoConnector(constants.DB_CONFIG) as db:
            if db.backup.find_one({'id': data['id']}):
                return 'The backup with id "' + data['id'] + '" already exists.', 400
            else:
                db.backup.insert(data)
                return 'OK', 200

    def put(self, backup_id):
        data = request.get_json()
        if backup_id == data['id']:
            return self._update_backup(data)
        else:
            return 'Backup id missmatch detected.', 400

    def _update_backup(self, data):
        with MongoConnector(constants.DB_CONFIG) as db:
            result = db.backup.update({'id': data['id']}, {'$set': data})
        if result['n']:
            return 'OK', 200
        else:
            return self._insert_backup(data)

    def delete(self, backup_id):
        with MongoConnector(constants.DB_CONFIG) as db:
            result = db.backup.update({'id': backup_id}, {'$set': {'deleted': True, 'deletion_date': self._current_date()}})
        if result['n']:
            return 'OK', 200
        else:
            return 'Requested backup does not exist.', 404

    def _current_date(self):
        return datetime.today().strftime(constants.DATE_FORMAT)
