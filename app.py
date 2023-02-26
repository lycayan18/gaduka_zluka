from flask import Flask, request
from flask_socketio import SocketIO, send
from flask_sqlalchemy import SQLAlchemy

from application import main_handlers
from application.anon_branch import AnonBranch
from application.auth_branch import AuthBranch
from database.models import UsersModel

from encryption.hashing import generate_token


class App:
    def __init__(self, app: Flask, socketio: SocketIO, database: SQLAlchemy):
        self.app = app
        self.socketio = socketio
        self.database = database

        self.anon_branch = AnonBranch(self.database)
        self.auth_branch = AuthBranch(self.database)

        self.branches = {
            '/anon': self.anon_branch,
            '/auth': self.auth_branch
        }

    def handle_message(self, query: dict):
        print(query)
        sid = request.sid
        query_parameters = query['parameters']

        if query['type'] == 'subscribe':
            for branch in self.branches.values():
                branch.disconnect_client(sid)
            self.branches[query['parameters']['branch']].connect_client(sid)

        elif query['type'] == 'send':
            self.branches[query['parameters']['branch']].handle_message(query)

        elif query['type'] == 'unsubscribe all':
            for branch in self.branches.values():
                branch.disconnect_client(sid)

        elif query['type'] == 'get token':
            response = self.get_token(login=query['parameters']['login'], password=query['parameters']['password'],
                                      message_id=query['id'])
            send(response, to=sid)

        elif query['type'] == 'create account':
            response = self.create_account(nickname=query_parameters['nickname'], login=query_parameters['login'],
                                           password=query_parameters['password'], message_id=query['id'])
            send(response, to=sid)

        elif query['type'] == 'get user data':
            send(self.get_user_data(query['id'], query_parameters['token']), to=sid)

    def get_token(self, login: str, password: str, message_id: int):
        token = generate_token(login, password)
        if not UsersModel.query.filter_by(token=token).first():
            error = {
                "type": "error",
                "id": message_id,
                "result": {
                    "message": "Invalid password or login",
                    "error-type": "invalid credentials"
                }
            }
            return error

        else:
            response = {
                'type': 'set token',
                'id': message_id,
                'result': {
                    'token': token,
                }}

            return response

    def get_user_data(self, message_id: int, token: str) -> dict:
        user = UsersModel.query.filter_by(token=token).first()
        response = {
            'type': 'set user data',
            'id': message_id,
            'result': {
                'nickname': user.nickname,
            }}

        return response

    def create_account(self, nickname: str, login: str, password: str, message_id: int) -> dict:
        token = generate_token(login, password)
        if UsersModel.query.filter_by(token=token).first():
            error = {
                "type": "error",
                "id": message_id,
                "result": {
                    "message": "login already used",
                    "error-type": "login already used"
                }
            }
            return error

        elif UsersModel.query.filter_by(nickname=nickname).first():
            error = {
                "type": "error",
                "id": message_id,
                "result": {
                    "message": "nickname already used",
                    "error-type": "nickname already used"
                }
            }
            return error

        else:
            response = {'type': 'set token',
                        'id': message_id,
                        'result': {'token': token}}

            user = UsersModel(nickname=nickname, token=token)
            self.database.session.add(user)
            self.database.session.commit()

            return response

    def register_handlers(self):
        main_handlers.register_main_handlers(self.app)
        self.socketio.on_event(message='message', handler=self.handle_message)

    def run(self):
        self.register_handlers()
        self.socketio.run(self.app, host='127.0.0.1', port=8080, debug=True)
