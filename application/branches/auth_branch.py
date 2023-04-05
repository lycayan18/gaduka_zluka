from typing import Callable
import datetime

from application.branches.branch import Branch
from application.managers.user_manager import UserManager
from database.database_manager import DatabaseManager
from application.utils.responses import *


class AuthBranch(Branch):
    def __init__(self, database: DatabaseManager, user_manager: UserManager):
        super(AuthBranch, self).__init__(database)
        self.user_manager = user_manager

    def get_latest_messages(self) -> dict:
        response = {
            "type": "new message",
            "result": []}

        last_messages = self.database.get_latest_message_from_auth()
        for item in last_messages:
            message = create_message(nickname=self.database.get_user_data(token=item.token).nickname, text=item.text,
                                     time=item.time, branch='/auth', ip=item.ip, status=item.status)
            response['result'].append(message)

        return response

    def add_message_to_database(self, **params):
        self.database.add_message_to_auth(**params)

    def handle_message(self, query: dict, callback: Callable, **params):
        token = params.get('token')
        ip = params.get('ip')
        status = 'admin' if self.user_manager.is_user_admin(params['sid']) else 'user'

        self.add_message_to_database(time=f'{datetime.datetime.now()}', text=query['parameters']['text'], token=token, ip=ip, status=status)

        for client in self.clients:
            response = create_new_message_response(
                nickname=self.database.get_user_data(token=token).nickname,
                text=query['parameters']['text'], time=f'{datetime.datetime.now()}', branch='/auth', ip=ip, status=status)

            callback(response, to=client)
