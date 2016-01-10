from lib.mdbconnector import MongoConnector, to_list
from flask import request
from flask_restful import Resource, abort
from api.nodeconfig import NodeConfig
from datetime import datetime
import constants
import requests


class Backup(Resource):
    DEFAULT_LIMIT = 30
    DEFAULT_OFFSET = 0

    def get(self, backup_id=None, node_id=None):
        limit = int(request.args.get('limit', self.DEFAULT_LIMIT))
        offset = int(request.args.get('offset', self.DEFAULT_OFFSET))
        deleted = bool(request.args.get('deleted', False))
        if backup_id:
            return self._get_backup_details(backup_id)
        else:
            return self._get_backup_list(node_id, deleted, limit, offset)

    def _get_backup_list(self, node_id=None, show_deleted=False, limit=DEFAULT_LIMIT, offset=DEFAULT_OFFSET):
        with MongoConnector(constants.DB_CONFIG) as db:
            query = {}
            if not show_deleted:
                query['deleted'] = False
            if node_id:
                query['id'] = node_id
            data = db.backup.find(query, {'_id': 0}).skip(offset).limit(limit)
        return to_list(data)

    def _get_backup_details(self, backup_id):
        with MongoConnector(constants.DB_CONFIG) as db:
            data = db.backup.find_one({'id': backup_id}, {'_id':0})
        if data:
            return data
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
