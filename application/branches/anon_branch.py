from typing import Callable
import datetime

from application.branches.branch import Branch
from database.database_manager import DatabaseManager
from application.utils.responses import *


class AnonBranch(Branch):
    def __init__(self, database: DatabaseManager):
        super(AnonBranch, self).__init__(database)

    def get_latest_messages(self) -> dict:
        response = {
            "type": "new message",
            "result": []}

        last_messages = self.database.get_latest_message_from_anon()
        for item in last_messages:
            message = create_message(nickname=item.nickname, text=item.text, time=item.time, branch='/anon', ip=item.ip, status=item.status)
            response['result'].append(message)

        return response

    def add_message_to_database(self, **params):
        self.database.add_message_to_anon(**params)

    def handle_message(self, query: dict, callback: Callable, **params):
        ip = params.get('ip')
        status = 'admin' if query['parameters']['nickname'] in ['drakutont', 'dungybug'] else 'user'
        self.add_message_to_database(time=f'{datetime.datetime.now()}', text=query['parameters']['text'],
                                     nickname=query['parameters']['nickname'], ip=ip, status=status)

        for client in self.clients:
            response = create_new_message_response(nickname=query['parameters']['nickname'],
                                                   text=query['parameters']['text'], time=f'{datetime.datetime.now()}', branch='/anon', ip=ip, status=status)

            callback(response, to=client)
