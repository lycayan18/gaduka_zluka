from typing import Callable

from flask_sqlalchemy import SQLAlchemy
import datetime

from application.abstract_branch import AbstractBranch
from database.queries import get_latest_message_from_anon, add_message_to_anon
from application.utils.responses import *


class AnonBranch(AbstractBranch):
    def __init__(self, database: SQLAlchemy):
        super(AnonBranch, self).__init__(database)

    @staticmethod
    def get_latest_messages() -> dict:
        response = {
            "type": "new message",
            "result": []}

        last_messages = get_latest_message_from_anon()
        for item in last_messages:
            message = create_message(nickname=item.nickname, text=item.text, time=item.time)
            response['result'].append(message)

        return response

    def add_message_to_database(self, message):
        add_message_to_anon(session=self.database.session, time=f'{datetime.datetime.now()}', text=message['text'],
                            nickname=message['nickname'])

    def handle_message(self, query: dict, callback: Callable):
        self.add_message_to_database(query['parameters'])

        for client in self.clients:
            response = create_new_message_response(nickname=query['parameters']['nickname'],
                                                   text=query['parameters']['text'], time=f'{datetime.datetime.now()}')

            callback(response, client)
