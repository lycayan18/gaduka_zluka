from flask import Flask, request
from flask_socketio import SocketIO, send
from flask_sqlalchemy import SQLAlchemy

from application import main_handlers
from application.anon_branch import AnonBranch
from application.auth_branch import AuthBranch

from encryption.hashing import generate_token
from database.queries import *
from application.utils.responses import *


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

            self.branches[query['parameters']['branch']].connect_client(sid, callback=self.send_message_to_client)

        elif query['type'] == 'send':
            self.branches[query['parameters']['branch']].handle_message(query, callback=self.send_message_to_client)

        elif query['type'] == 'unsubscribe all':
            for branch in self.branches.values():
                branch.disconnect_client(sid)

        elif query['type'] == 'get token':
            response = self.get_token(login=query['parameters']['login'], password=query['parameters']['password'],
                                      message_id=query['id'])

            self.send_message_to_client(response, sid)

        elif query['type'] == 'create account':
            response = self.create_account(nickname=query_parameters['nickname'], login=query_parameters['login'],
                                           password=query_parameters['password'], message_id=query['id'])

            self.send_message_to_client(response, sid)

        elif query['type'] == 'get user data':
            self.send_message_to_client(self.get_user_data(query['id'], query_parameters['token']), sid)

    def create_account(self, nickname: str, login: str, password: str, message_id: int) -> dict:
        token = generate_token(login, password)
        if get_user_data(token=token):
            error = create_error_response(message_id=message_id, message='login already used',
                                          error_type='login already used')
            return error

        elif get_user_data(nickname=nickname):
            error = create_error_response(message_id=message_id, message='nickname already used',
                                          error_type='nickname already used')

            return error

        else:
            response = create_set_token_response(message_id=message_id, token=token)

            add_user(session=self.database.session, token=token, nickname=nickname)

            return response

    @staticmethod
    def send_message_to_client(message: dict, sid: str):
        send(message, to=sid)

    @staticmethod
    def get_token(login: str, password: str, message_id: int):
        token = generate_token(login, password)
        if not get_user_data(token=token):
            error = create_error_response(message_id=message_id, message='Invalid password or login',
                                          error_type='invalid credentials')

            return error

        else:
            response = create_set_token_response(message_id=message_id, token=token)

            return response

    @staticmethod
    def get_user_data(message_id: int, token: str) -> dict:
        user = get_user_data(token=token)
        if user:
            response = create_set_user_data_response(message_id=message_id, nickname=user.nickname)

        else:
            response = create_set_user_data_response(message_id=message_id, nickname='')

        return response

    def register_handlers(self):
        main_handlers.register_main_handlers(self.app)
        self.socketio.on_event(message='message', handler=self.handle_message)

    def run(self):
        self.register_handlers()
        self.socketio.run(self.app, host='192.168.0.109', port=8080, debug=True)
