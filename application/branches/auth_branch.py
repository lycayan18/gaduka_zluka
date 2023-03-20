from typing import Callable
import datetime

from application.branches.abstract_branch import AbstractBranch
from database.database_manager import DatabaseManager
from application.utils.responses import *


class AuthBranch(AbstractBranch):
    def __init__(self, database: DatabaseManager):
        super(AuthBranch, self).__init__(database)

    def get_latest_messages(self) -> dict:
        response = {
            "type": "new message",
            "result": []}

        last_messages = self.database.get_latest_message_from_auth()
        for item in last_messages:
            message = create_message(nickname=self.database.get_user_data(token=item.token).nickname, text=item.text,
                                     time=item.time)
            response['result'].append(message)

        return response

    def add_message_to_database(self, message):
        self.database.add_message_to_auth(time=f'{datetime.datetime.now()}', token=message['token'],
                                          text=message['text'])

    def handle_message(self, query: dict, callback: Callable):
        self.add_message_to_database(query['parameters'])

        for client in self.clients:
            response = create_new_message_response(
                nickname=self.database.get_user_data(token=query['parameters']['token']).nickname,
                text=query['parameters']['text'], time=f'{datetime.datetime.now()}')

            callback(response, to=client)
