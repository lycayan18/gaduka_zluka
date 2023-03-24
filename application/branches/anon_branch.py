from typing import Callable
import datetime

from application.branches.abstract_branch import AbstractBranch
from database.database_manager import DatabaseManager
from application.utils.responses import *


class AnonBranch(AbstractBranch):
    def __init__(self, database: DatabaseManager):
        super(AnonBranch, self).__init__(database)

    def get_latest_messages(self) -> dict:
        response = {
            "type": "new message",
            "result": []}

        last_messages = self.database.get_latest_message_from_anon()
        for item in last_messages:
            message = create_message(nickname=item.nickname, text=item.text, time=item.time)
            response['result'].append(message)

        return response

    def add_message_to_database(self, **params):
        self.database.add_message_to_anon(**params)

    def handle_message(self, query: dict, callback: Callable, **params):
        self.add_message_to_database(time=f'{datetime.datetime.now()}', text=query['parameters']['text'],
                                     nickname=query['parameters']['nickname'])

        for client in self.clients:
            response = create_new_message_response(nickname=query['parameters']['nickname'],
                                                   text=query['parameters']['text'], time=f'{datetime.datetime.now()}')

            callback(response, to=client)
