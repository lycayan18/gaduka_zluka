from flask_socketio import send
from flask_sqlalchemy import SQLAlchemy
import datetime

from application.abstract_branch import AbstractBranch
from database.models import AnonBranchModel


class AnonBranch(AbstractBranch):
    def __init__(self, database: SQLAlchemy):
        super(AnonBranch, self).__init__(database)

    def get_latest_messages(self) -> dict:
        response = {
                "type": "new message",
                "result": []}

        last_messages = AnonBranchModel.query.all()
        for item in last_messages:
            message = {
                'nickname': item.nickname,
                'text': item.text,
                'time': item.time
            }
            response['result'].append(message)

        return response

    def add_message_to_database(self, message):
        message = AnonBranchModel(time=f'{datetime.datetime.now()}',
                                  text=message['text'], nickname=message['nickname'])
        self.database.session.add(message)
        self.database.session.commit()

    def handle_message(self, query: dict):
        self.add_message_to_database(query['parameters'])
        for client in self.clients:
            new_data = {
                "type": "new message",
                "result": [{
                    "nickname": query['parameters']['nickname'],
                    "text": query['parameters']['text'],
                    "time": f'{datetime.datetime.now()}'
                }]
            }
            send(new_data, to=client)
