from typing import Callable
import datetime
from flask_sqlalchemy import SQLAlchemy

from application.abstract_branch import AbstractBranch
from database.queries import get_latest_message_from_auth, add_message_to_auth, get_user_data
from application.utils.responses import *


class AuthBranch(AbstractBranch):
    def __init__(self, database: SQLAlchemy):
        super(AuthBranch, self).__init__(database)

    def get_latest_messages(self) -> dict:
        response = {
            "type": "new message",
            "result": []}

        last_messages = get_latest_message_from_auth()
        for item in last_messages:
            message = create_message(nickname=get_user_data(token=item.token).nickname, text=item.text, time=item.time)
            response['result'].append(message)

        return response

    def add_message_to_database(self, message):
        add_message_to_auth(session=self.database.session, time=f'{datetime.datetime.now()}', token=message['token'],
                            text=message['text'])

    def handle_message(self, query: dict, callback: Callable):
        self.add_message_to_database(query['parameters'])

        for client in self.clients:
            response = create_new_message_response(nickname=get_user_data(token=query['parameters']['token']).nickname,
                                                   text=query['parameters']['text'], time=f'{datetime.datetime.now()}')

            callback(response, client)
