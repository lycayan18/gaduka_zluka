from flask import request
from typing import Callable

from application.branches.anon_branch import AnonBranch
from application.branches.auth_branch import AuthBranch
from application.branches.anon_rand_branch import AnonRandBranch
from application.user_manager import UserManager

from encryption.hashing import generate_token
from database.database_manager import *
from application.utils.responses import *


class BranchManager:
    def __init__(self, database: DatabaseManager):
        self.database = database
        self.user_manager = UserManager(database=database)

        self.anon_branch = AnonBranch(self.database)
        self.auth_branch = AuthBranch(self.database)
        self.anon_rand_branch = AnonRandBranch(self.database)

        self.branches = {
            '/anon': self.anon_branch,
            '/auth': self.auth_branch,
            '/anon/rand': self.anon_rand_branch
        }

    def disconnect_user_from_branch(self, sid: str, callback: Callable):
        for branch in self.branches.values():
            branch.disconnect_client(sid, callback=callback)
        self.user_manager.disconnect_user(sid)

    def handle_message(self, query: dict, callback: Callable):
        sid = request.sid
        query_parameters = query['parameters']

        if query['type'] == 'subscribe':
            for branch in self.branches.values():
                branch.disconnect_client(sid)

            self.branches[query['parameters']['branch']].connect_client(sid, callback=callback)

        elif query['type'] == 'send':
            token = self.user_manager.get_token_by_sid(sid)
            self.branches[query['parameters']['branch']].handle_message(query, callback=callback, token=token, sid=sid)

        elif query['type'] == 'unsubscribe all':
            for branch in self.branches.values():
                branch.disconnect_client(sid)

        elif query['type'] == 'get token':
            token = generate_token(login=query['parameters']['login'], password=query['parameters']['password'])
            response = self.user_manager.get_token(token=token, message_id=query['id'])
            callback(response, to=sid)

        elif query['type'] == 'create account':
            response = self.user_manager.create_account(nickname=query_parameters['nickname'],
                                                        login=query_parameters['login'],
                                                        password=query_parameters['password'], message_id=query['id'])
            callback(response, to=sid)

        elif query['type'] == 'get user data':
            callback(self.user_manager.get_user_data(token=query_parameters['token'], message_id=query['id']), to=sid)

        elif query['type'] == 'authorize user':
            response = create_authorize_user_response(message_id=query['id'], result=self.user_manager.authorize_user(sid, token=query_parameters['token']))
            callback(response, to=sid)
