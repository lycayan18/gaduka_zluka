from flask_socketio import send
from application.abstract_branch import AbstractBranch
import datetime


class AuthBranch(AbstractBranch):
    def __init__(self):
        super(AuthBranch, self).__init__()

    def get_latest_messages(self) -> dict:
        pass

    def add_message_to_database(self, message):
        pass

    def handle_message(self, query: dict):
        if query['type'] == 'subscribe':
            new_data = self.get_latest_messages()
            send(new_data)

        elif query['type'] == 'send':
            new_data = {
                "type": "new message",
                "result": [{
                    "nickname": query['parameters']['nickname'],
                    "text": query['parameters']['text'],
                    "time": f'{datetime.datetime.now()}'
                }]
            }
            send(new_data, broadcast=True)
