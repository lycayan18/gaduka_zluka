from flask_socketio import send
from flask_sqlalchemy import SQLAlchemy
from application.abstract_branch import AbstractBranch
from database.models import AuthBranchModel
import datetime


class AuthBranch(AbstractBranch):
    def __init__(self, database: SQLAlchemy):
        super(AuthBranch, self).__init__(database)

    def get_latest_messages(self) -> dict:
        response = {
                "type": "new message",
                "result": []}

        last_messages = AuthBranchModel.query.all()
        for item in last_messages:
            message = {
                'nickname': self.get_user_data(item.token)['nickname'],
                'text': item.text,
                'time': item.time
            }
            response['result'].append(message)

        return response

    def add_message_to_database(self, message):
        message = AuthBranchModel(time=f'{datetime.datetime.now()}', token=message['token'],
                                  text=message['text'])
        self.database.session.add(message)
        self.database.session.commit()

    def handle_message(self, query: dict):
        self.add_message_to_database(query['parameters'])
        for client in self.clients:
            new_data = {
                "type": "new message",
                "result": [{
                    "nickname": self.get_user_data(query['parameters']['token'])['nickname'],
                    "text": query['parameters']['text'],
                    "time": f'{datetime.datetime.now()}'
                }]
            }
            send(new_data, to=client)
